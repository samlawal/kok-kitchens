import { describe, it, expect } from "vitest";
import { londonTime, paymentLines, buildPushRequest } from "./notify";
import type { PaymentMethod } from "./notify";

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
    // Title prefix stays ASCII (goes into the HTTP Title header).
    expect(titlePrefix).toBe("PAID");
    // Body keeps the visual emoji.
    expect(bodyLine).toBe("💳 PAID by card — no collection needed");
  });

  it("marks COD orders as PAY ON DELIVERY with the explicit amount to collect", () => {
    const { titlePrefix, bodyLine } = paymentLines("cod", 45);
    expect(titlePrefix).toBe("COD");
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

// Regression suite for the "no order pushes arriving" incident (25 Jun 2026):
// The previous version put "💳"/"💷" straight into the ntfy Title HTTP header.
// Node's undici (Next's fetch) silently drops requests when it sees non-ASCII
// bytes in a header value per RFC 7230, so every order push was dropped without
// erroring. These tests lock the contract in: the Title header must stay pure
// printable ASCII. Emojis can live in the body — HTTP bodies handle UTF-8 fine.
describe("buildPushRequest — ntfy header contract", () => {
  const order = (paymentMethod: PaymentMethod, over = {}) => ({
    ref: "KOK-260625-AB12",
    customerName: "Ada Obi",
    customerPhone: "07123456789",
    deliveryType: "delivery",
    paymentMethod,
    items: [{ name: "Jollof Rice", quantity: 2, price: 12 }],
    total: 24,
    ...over,
  });

  const ASCII_PRINTABLE = /^[\x20-\x7E]+$/;

  it("card order Title header is pure printable ASCII", () => {
    const req = buildPushRequest(order("card"));
    expect(req.headers.Title).toMatch(ASCII_PRINTABLE);
  });

  it("COD order Title header is pure printable ASCII", () => {
    const req = buildPushRequest(order("cod"));
    expect(req.headers.Title).toMatch(ASCII_PRINTABLE);
  });

  it("never puts a payment emoji in the Title header (the actual bug)", () => {
    // The specific characters that caused undici to drop the request.
    for (const method of ["card", "cod"] as const) {
      const t = buildPushRequest(order(method)).headers.Title;
      expect(t).not.toContain("💳");
      expect(t).not.toContain("💷");
      // Also the middle-dot separator from the earlier attempt — non-ASCII.
      expect(t).not.toContain("·");
    }
  });

  it("all other headers we send are ASCII too", () => {
    const req = buildPushRequest(order("card"));
    for (const [name, value] of Object.entries(req.headers)) {
      expect(value, `header ${name}`).toMatch(ASCII_PRINTABLE);
    }
  });

  it("still distinguishes card vs COD in the title (kitchen can tell at a glance)", () => {
    expect(buildPushRequest(order("card")).headers.Title).toMatch(/\bPAID\b/);
    expect(buildPushRequest(order("cod")).headers.Title).toMatch(/\bCOD\b/);
  });

  it("keeps the payment emoji + amount in the body's first line (drivers see it on the lock screen)", () => {
    const cardBody = buildPushRequest(order("card")).body;
    expect(cardBody.split("\n")[0]).toBe("💳 PAID by card — no collection needed");

    const codBody = buildPushRequest(order("cod", { total: 45 })).body;
    expect(codBody.split("\n")[0]).toBe("💷 PAY ON DELIVERY — collect £45.00");
  });

  it("body carries the full order (customer, items, total, phone, placed time)", () => {
    const req = buildPushRequest(order("card"));
    expect(req.body).toContain("Ada Obi");
    expect(req.body).toContain("2x Jollof Rice");
    expect(req.body).toContain("Total: £24.00");
    expect(req.body).toContain("Phone: 07123456789");
    expect(req.body).toMatch(/Placed \d{2}:\d{2}/);
  });

  it("posts to https://ntfy.sh/${NTFY_TOPIC}", () => {
    const req = buildPushRequest(order("card"));
    expect(req.url).toMatch(/^https:\/\/ntfy\.sh\/[a-z0-9-]+$/);
  });
});
