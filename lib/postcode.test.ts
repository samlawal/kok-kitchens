import { describe, it, expect } from "vitest";
import {
  outwardPrefix,
  haversineMiles,
  zoneFromPostcode,
  KITCHEN,
} from "./postcode";

describe("outwardPrefix", () => {
  it("extracts the outward area+district", () => {
    expect(outwardPrefix("WD7 8PQ")).toBe("WD7");
    expect(outwardPrefix("en5 3xy")).toBe("EN5");
    expect(outwardPrefix("N12 0AA")).toBe("N12");
  });

  it("handles a partial (outward-only) entry", () => {
    expect(outwardPrefix("WD18")).toBe("WD18");
    expect(outwardPrefix("N1")).toBe("N1");
  });
});

describe("haversineMiles", () => {
  it("is zero for the same point", () => {
    expect(haversineMiles(KITCHEN.lat, KITCHEN.lng, KITCHEN.lat, KITCHEN.lng)).toBeCloseTo(0, 5);
  });

  it("matches the kitchen → Watford (WD18) distance (~3 miles)", () => {
    const miles = haversineMiles(KITCHEN.lat, KITCHEN.lng, 51.653142, -0.394186);
    expect(miles).toBeGreaterThan(2.5);
    expect(miles).toBeLessThan(3.5);
  });
});

describe("zoneFromPostcode", () => {
  it("returns local for a curated local prefix", () => {
    expect(zoneFromPostcode("WD7 8PQ")).toBe("local");
    expect(zoneFromPostcode("EN5 3AB")).toBe("local");
  });

  it("returns extended for a curated extended prefix", () => {
    expect(zoneFromPostcode("WD18 0AA")).toBe("extended");
    expect(zoneFromPostcode("HA1 1AA")).toBe("extended");
  });

  // Unlisted postcode within delivery range → extended (distance fallback).
  it("treats an unlisted but nearby postcode as extended", () => {
    const nearby = { latitude: KITCHEN.lat, longitude: KITCHEN.lng };
    expect(zoneFromPostcode("ZZ1 1ZZ", nearby)).toBe("extended");
  });

  // Unlisted and too far → unknown (out of area).
  it("treats an unlisted, far postcode as unknown", () => {
    const manchester = { latitude: 53.4808, longitude: -2.2426 };
    expect(zoneFromPostcode("M1 1AE", manchester)).toBe("unknown");
  });

  it("is unknown for an unlisted postcode with no coords", () => {
    expect(zoneFromPostcode("ZZ1 1ZZ")).toBe("unknown");
  });
});
