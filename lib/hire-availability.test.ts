import { describe, it, expect } from "vitest";
import {
  addDays,
  rangesOverlap,
  bookingHoldsStock,
  computeAvailability,
  availableForItem,
  TURNAROUND_BUFFER_DAYS,
  type HireBooking,
} from "./hire-availability";

const NOW = Date.parse("2026-06-19T12:00:00Z");

// A confirmed booking for `qty` of `item` over [out, ret].
function booking(
  item: string,
  qty: number,
  out: string,
  ret: string,
  overrides: Partial<HireBooking> = {}
): HireBooking {
  return {
    status: "confirmed",
    hire_out_date: out,
    return_date: ret,
    items: [{ item_id: item, quantity: qty }],
    ...overrides,
  };
}

describe("addDays", () => {
  it("adds days across month boundaries in UTC", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDays("2026-06-19", 0)).toBe("2026-06-19");
  });
});

describe("rangesOverlap", () => {
  it("detects overlapping and adjacent ranges", () => {
    expect(rangesOverlap("2026-06-10", "2026-06-12", "2026-06-11", "2026-06-15")).toBe(true);
    expect(rangesOverlap("2026-06-10", "2026-06-12", "2026-06-12", "2026-06-15")).toBe(true); // touch
  });
  it("returns false for disjoint ranges", () => {
    expect(rangesOverlap("2026-06-10", "2026-06-12", "2026-06-13", "2026-06-15")).toBe(false);
  });
});

describe("bookingHoldsStock", () => {
  it("holds for confirmed/out/returned/enquiry", () => {
    for (const status of ["enquiry", "confirmed", "out", "returned"]) {
      expect(bookingHoldsStock(booking("x", 1, "2026-07-01", "2026-07-01", { status }), NOW)).toBe(true);
    }
  });
  it("does not hold for cancelled/closed", () => {
    for (const status of ["cancelled", "closed", "restocked"]) {
      expect(bookingHoldsStock(booking("x", 1, "2026-07-01", "2026-07-01", { status }), NOW)).toBe(false);
    }
  });
  it("releases an expired soft-hold enquiry", () => {
    const expired = booking("x", 1, "2026-07-01", "2026-07-01", {
      status: "enquiry",
      hold_expires_at: "2026-06-19T10:00:00Z", // before NOW
    });
    const live = booking("x", 1, "2026-07-01", "2026-07-01", {
      status: "enquiry",
      hold_expires_at: "2026-06-20T10:00:00Z", // after NOW
    });
    expect(bookingHoldsStock(expired, NOW)).toBe(false);
    expect(bookingHoldsStock(live, NOW)).toBe(true);
  });
});

describe("computeAvailability", () => {
  const inv = { "chafing-single": 10, "charger-gold": 50 };

  it("subtracts overlapping holding bookings", () => {
    const bookings = [booking("chafing-single", 3, "2026-07-10", "2026-07-10")];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW });
    expect(rows["chafing-single"]).toEqual({ total: 10, booked: 3, available: 7 });
    expect(rows["charger-gold"]).toEqual({ total: 50, booked: 0, available: 50 });
  });

  it("ignores bookings that don't overlap the requested window", () => {
    const bookings = [booking("chafing-single", 4, "2026-08-01", "2026-08-01")];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW });
    expect(rows["chafing-single"].available).toBe(10);
  });

  it("blocks within the turnaround buffer after return", () => {
    // Returns on the 10th; with a 1-day buffer it's still blocked on the 11th.
    const bookings = [booking("chafing-single", 2, "2026-07-09", "2026-07-10")];
    const rows = computeAvailability(inv, bookings, "2026-07-11", "2026-07-11", {
      nowMs: NOW,
      bufferDays: TURNAROUND_BUFFER_DAYS,
    });
    expect(rows["chafing-single"].available).toBe(8);
    // Free again the day after the buffer.
    const after = computeAvailability(inv, bookings, "2026-07-12", "2026-07-12", { nowMs: NOW });
    expect(after["chafing-single"].available).toBe(10);
  });

  it("sums multiple overlapping bookings and clamps at zero", () => {
    const bookings = [
      booking("chafing-single", 6, "2026-07-10", "2026-07-10"),
      booking("chafing-single", 8, "2026-07-10", "2026-07-10"),
    ];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW });
    expect(rows["chafing-single"]).toEqual({ total: 10, booked: 14, available: 0 });
  });

  it("excludes expired soft holds from the count", () => {
    const bookings = [
      booking("chafing-single", 5, "2026-07-10", "2026-07-10", {
        status: "enquiry",
        hold_expires_at: "2026-06-19T10:00:00Z", // expired
      }),
    ];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW });
    expect(rows["chafing-single"].available).toBe(10);
  });

  it("ignores cancelled and closed bookings even when they overlap", () => {
    const bookings = [
      booking("chafing-single", 5, "2026-07-10", "2026-07-10", { status: "cancelled" }),
      booking("chafing-single", 4, "2026-07-10", "2026-07-10", { status: "closed" }),
    ];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW });
    expect(rows["chafing-single"].available).toBe(10);
  });

  it("ignores zero/negative quantity lines inside a booking", () => {
    const bookings: HireBooking[] = [
      {
        status: "confirmed",
        hire_out_date: "2026-07-10",
        return_date: "2026-07-10",
        items: [
          { item_id: "chafing-single", quantity: 0 },
          { item_id: "chafing-single", quantity: -2 },
        ],
      },
    ];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW });
    expect(rows["chafing-single"].available).toBe(10);
  });

  it("treats a request window spanning a booking as overlapping", () => {
    const bookings = [booking("chafing-single", 6, "2026-07-12", "2026-07-12")];
    const rows = computeAvailability(inv, bookings, "2026-07-10", "2026-07-20", { nowMs: NOW });
    expect(rows["chafing-single"].available).toBe(4);
  });
});

describe("availableForItem", () => {
  it("returns null for unmanaged items (no inventory row)", () => {
    expect(availableForItem("unknown", { "chafing-single": 10 }, [], "2026-07-10", "2026-07-10", { nowMs: NOW })).toBeNull();
  });
  it("returns the available count for managed items", () => {
    const bookings = [booking("chafing-single", 2, "2026-07-10", "2026-07-10")];
    expect(availableForItem("chafing-single", { "chafing-single": 10 }, bookings, "2026-07-10", "2026-07-10", { nowMs: NOW })).toBe(8);
  });
});
