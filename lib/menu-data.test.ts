import { describe, it, expect } from "vitest";
import { formatPrice } from "./menu-data";

// formatPrice is the shared price renderer used across the menu and admin. It
// crashed the whole /admin subtree in bug-2026-07-21-Jc0pDnIObaI because it did
// `amount.toFixed(2)` on a Neon-returned STRING price. These tests lock in the
// D-005 hardening: it must render correctly for numbers AND never throw on the
// string prices the DB layer can hand back.

describe("formatPrice", () => {
  it("formats a number to 2dp with a £ prefix", () => {
    expect(formatPrice(55)).toBe("£55.00");
    expect(formatPrice(8.5)).toBe("£8.50");
    expect(formatPrice(0)).toBe("£0.00");
  });

  it("does NOT throw on a string price (Neon NUMERIC comes back as a string)", () => {
    // This is the exact regression: "55.00" (string) used to throw
    // "amount.toFixed is not a function" and take the admin page down.
    expect(() => formatPrice("55.00" as unknown as number)).not.toThrow();
    expect(formatPrice("55.00" as unknown as number)).toBe("£55.00");
    expect(formatPrice("8.5" as unknown as number)).toBe("£8.50");
  });
});
