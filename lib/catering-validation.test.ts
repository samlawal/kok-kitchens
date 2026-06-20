import { describe, it, expect } from "vitest";
import { validateCateringEnquiry } from "./catering-validation";

const TODAY = "2026-06-20";

const base = {
  name: "Ada Obi",
  phone: "07123456789",
  email: "ada@example.com",
  eventDate: "2026-09-01",
  guestCount: "120",
  eventType: "wedding",
  details: "Outdoor reception",
};

describe("validateCateringEnquiry — happy path", () => {
  it("accepts a complete future enquiry and normalises fields", () => {
    const r = validateCateringEnquiry(base, { today: TODAY });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.name).toBe("Ada Obi");
    expect(r.email).toBe("ada@example.com");
    expect(r.eventIso).toBe("2026-09-01");
    expect(r.guestCount).toBe(120);
    expect(r.eventType).toBe("wedding");
  });

  it("accepts today's date (not in the past)", () => {
    const r = validateCateringEnquiry({ ...base, eventDate: TODAY }, { today: TODAY });
    expect(r.ok).toBe(true);
  });

  it("trims whitespace and floors a fractional guest count", () => {
    const r = validateCateringEnquiry(
      { ...base, name: "  Ada  ", guestCount: "99.7" },
      { today: TODAY },
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.name).toBe("Ada");
    expect(r.guestCount).toBe(99);
  });

  it("defaults a missing/blank event type to 'other'", () => {
    const r = validateCateringEnquiry({ ...base, eventType: "" }, { today: TODAY });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.eventType).toBe("other");
  });
});

describe("validateCateringEnquiry — required fields", () => {
  it.each([
    ["name", { ...base, name: "" }],
    ["phone", { ...base, phone: "  " }],
    ["email", { ...base, email: "" }],
  ])("rejects a missing %s", (_field, input) => {
    const r = validateCateringEnquiry(input, { today: TODAY });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.status).toBe(400);
  });

  it("rejects a malformed email", () => {
    const r = validateCateringEnquiry({ ...base, email: "ada@nowhere" }, { today: TODAY });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toMatch(/email/i);
  });
});

describe("validateCateringEnquiry — event date", () => {
  it("rejects a missing date", () => {
    const r = validateCateringEnquiry({ ...base, eventDate: "" }, { today: TODAY });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.status).toBe(400);
  });

  it("rejects an impossible calendar date", () => {
    const r = validateCateringEnquiry({ ...base, eventDate: "2026-13-40" }, { today: TODAY });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toMatch(/valid event date/i);
  });

  it("rejects a date in the past", () => {
    const r = validateCateringEnquiry({ ...base, eventDate: "2026-06-19" }, { today: TODAY });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toMatch(/past/i);
  });
});

describe("validateCateringEnquiry — guest count", () => {
  it.each([["0"], ["-5"], ["abc"], [""]])(
    "rejects a non-positive / non-numeric guest count: %s",
    (guestCount) => {
      const r = validateCateringEnquiry({ ...base, guestCount }, { today: TODAY });
      expect(r.ok).toBe(false);
      if (r.ok) return;
      expect(r.status).toBe(400);
    },
  );
});
