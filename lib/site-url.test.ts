import { describe, it, expect } from "vitest";
import { resolveSiteUrl } from "./site-url";

// Regression: the go-live fix that replaced the hardcoded Vercel preview URL
// baked into the SEO/canonical files with one env-driven origin.
describe("resolveSiteUrl", () => {
  it("uses the env value when set", () => {
    expect(resolveSiteUrl("https://kokkitchens.com")).toBe("https://kokkitchens.com");
    expect(resolveSiteUrl("https://example.org")).toBe("https://example.org");
  });

  it("strips trailing slashes so built URLs don't double up", () => {
    expect(resolveSiteUrl("https://kokkitchens.com/")).toBe("https://kokkitchens.com");
    expect(resolveSiteUrl("https://kokkitchens.com///")).toBe("https://kokkitchens.com");
  });

  it("falls back to the live domain when unset/blank", () => {
    expect(resolveSiteUrl(undefined)).toBe("https://kokkitchens.com");
    expect(resolveSiteUrl(null)).toBe("https://kokkitchens.com");
    expect(resolveSiteUrl("")).toBe("https://kokkitchens.com");
    expect(resolveSiteUrl("   ")).toBe("https://kokkitchens.com");
  });

  it("trims surrounding whitespace/newlines from the env value", () => {
    expect(resolveSiteUrl("  https://kokkitchens.com\n")).toBe("https://kokkitchens.com");
  });

  it("never falls back to a preview/placeholder URL", () => {
    expect(resolveSiteUrl(undefined)).not.toContain("vercel.app");
  });
});
