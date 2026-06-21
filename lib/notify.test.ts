import { describe, it, expect } from "vitest";
import { londonTime } from "./notify";

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
