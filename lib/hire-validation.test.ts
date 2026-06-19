import { describe, it, expect } from "vitest";
import {
  validateHireEnquiry,
  isRealIsoDate,
  type EnquiryInput,
} from "./hire-validation";

const CATALOGUE = [
  { id: "chafing-single", name: "Chafing Dish — Single", price: 10 },
  { id: "charger-gold", name: "Charger Plate — Gold", price: 3 },
];

const TODAY = "2026-06-19";

function base(overrides: Partial<EnquiryInput> = {}): EnquiryInput {
  return {
    name: "Ada",
    phone: "+447447982712",
    items: [{ id: "chafing-single", quantity: 2 }],
    ...overrides,
  };
}

function run(input: EnquiryInput) {
  return validateHireEnquiry(input, CATALOGUE, { today: TODAY });
}

describe("isRealIsoDate", () => {
  it("accepts real ISO dates", () => {
    expect(isRealIsoDate("2026-07-20")).toBe(true);
    expect(isRealIsoDate("2026-02-28")).toBe(true);
  });
  it("rejects malformed or impossible dates", () => {
    expect(isRealIsoDate("2026-13-40")).toBe(false); // bad month/day
    expect(isRealIsoDate("2026-02-30")).toBe(false); // Feb 30 doesn't exist
    expect(isRealIsoDate("20-07-2026")).toBe(false); // wrong order
    expect(isRealIsoDate("tomorrow")).toBe(false);
    expect(isRealIsoDate("")).toBe(false);
  });
});

describe("validateHireEnquiry — positive", () => {
  it("accepts a valid enquiry with a future date and resolves catalogue prices", () => {
    const r = run(base({ eventDate: "2026-07-20", items: [{ id: "chafing-single", quantity: 2 }] }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.eventIso).toBe("2026-07-20");
    expect(r.lines).toEqual([
      { id: "chafing-single", name: "Chafing Dish — Single", price: 10, qty: 2, line: 20 },
    ]);
    expect(r.total).toBe(20);
  });

  it("allows today as the event date (not past)", () => {
    const r = run(base({ eventDate: TODAY }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.eventIso).toBe(TODAY);
  });

  it("allows an enquiry with no date (eventIso null)", () => {
    const r = run(base({ eventDate: undefined }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.eventIso).toBeNull();
  });

  it("uses catalogue prices, ignoring any client-supplied price field", () => {
    const r = run(base({ items: [{ id: "charger-gold", quantity: 4, price: 999 } as never] }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(12); // 4 × £3, not £999
  });

  it("drops invalid lines but keeps the valid ones", () => {
    const r = run(
      base({
        items: [
          { id: "chafing-single", quantity: 1 },
          { id: "does-not-exist", quantity: 5 },
          { id: "charger-gold", quantity: 0 },
        ],
      })
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.lines.map((l) => l.id)).toEqual(["chafing-single"]);
      expect(r.total).toBe(10);
    }
  });
});

describe("validateHireEnquiry — negative", () => {
  it("rejects a missing name", () => {
    const r = run(base({ name: "" }));
    expect(r).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects a missing phone", () => {
    const r = run(base({ phone: "   " }));
    expect(r).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects an empty items array", () => {
    const r = run(base({ items: [] }));
    expect(r).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects when every item has zero/negative quantity", () => {
    const r = run(base({ items: [{ id: "chafing-single", quantity: 0 }, { id: "charger-gold", quantity: -3 }] }));
    expect(r).toMatchObject({ ok: false, status: 400, message: "No valid hire items selected" });
  });

  it("rejects non-numeric quantities", () => {
    const r = run(base({ items: [{ id: "chafing-single", quantity: "lots" }] }));
    expect(r).toMatchObject({ ok: false, status: 400, message: "No valid hire items selected" });
  });

  it("rejects unknown item ids", () => {
    const r = run(base({ items: [{ id: "totally-made-up", quantity: 2 }] }));
    expect(r).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects a date in the past", () => {
    const r = run(base({ eventDate: "2020-01-01" }));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.status).toBe(400);
      expect(r.message.toLowerCase()).toContain("past");
    }
  });

  it("rejects the day before today as past", () => {
    const r = run(base({ eventDate: "2026-06-18" })); // TODAY is 2026-06-19
    expect(r).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects a malformed date", () => {
    const r = run(base({ eventDate: "19/06/2026" }));
    expect(r).toMatchObject({ ok: false, status: 400 });
    if (!r.ok) expect(r.message.toLowerCase()).toContain("valid");
  });

  it("rejects an impossible calendar date", () => {
    const r = run(base({ eventDate: "2026-02-31" }));
    expect(r).toMatchObject({ ok: false, status: 400 });
  });
});
