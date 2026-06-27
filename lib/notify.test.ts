import { describe, it, expect } from "vitest";
import { londonTime, paymentLines } from "./notify";

describe("londonTime — UK-local HH:MM for alert 'Placed' lines", () => {
  it("formats summer time as BST (UTC+1)", () => {
    expect(londonTime(new Date("2026-06-21T13:05:00Z"))).toBe("14:05");
  });

  it("formats winter time as GMT (UTC+0)", () => {
    expect(londonTime(new Date("2026-01-15T09:30:00Z"))).toBe("09:30");
  });

  it("zero-pads hours and minutes", () => {
    expect(londonTime(new Date("2026-01-15T08:07:00Z"))).toBe("08:07");
  });
});

describe("paymentLines — push title + body lead by payment method", () => {
  it("marks card orders as PAID (no collection)", () => {
    const { titlePrefix, bodyLine } = paymentLines("card", 45);
    expect(titlePrefix).toBe("💳 PAID");
    expect(bodyLine).toBe("💳 PAID by card — no collection needed");
  });

  it("marks COD orders as PAY ON DELIVERY with the explicit amount to collect", () => {
    const { titlePrefix, bodyLine } = paymentLines("cod", 45);
    expect(titlePrefix).toBe("💷 COD");
    // Driver shouldn't have to scroll to find the total.
    expect(bodyLine).toBe("💷 PAY ON DELIVERY — collect £45.00");
  });

  it("formats the collect amount to 2dp even for whole numbers", () => {
    expect(paymentLines("cod", 20).bodyLine).toBe(
      "💷 PAY ON DELIVERY — collect £20.00",
    );
  });

  it("formats the collect amount correctly with fractional pence", () => {
    expect(paymentLines("cod", 17.5).bodyLine).toBe(
      "💷 PAY ON DELIVERY — collect £17.50",
    );
  });
});
