import { describe, it, expect } from "vitest";
import { buildImageMap, type BlobLike } from "./blob-images";

function blob(pathname: string, ms = 1_700_000_000_000): BlobLike {
  return {
    pathname,
    url: `https://store.public.blob.vercel-storage.com/${pathname}`,
    uploadedAt: new Date(ms),
  };
}

describe("buildImageMap", () => {
  // Regression: the original bug was that admin uploads landed in Blob storage
  // but nothing ever resolved them, so the menu kept showing static files.
  // This asserts an uploaded blob actually surfaces in the map for its item id.
  it("surfaces an uploaded photo under its menu item id", () => {
    const map = buildImageMap([blob("meals/jollof-rice.webp")]);
    expect(map["jollof-rice"]).toBe(
      "https://store.public.blob.vercel-storage.com/meals/jollof-rice.webp?v=1700000000000"
    );
  });

  it("ignores rollback copies", () => {
    const map = buildImageMap([
      blob("meals/jollof-rice.webp"),
      blob("meals/_rollback/jollof-rice.webp"),
    ]);
    expect(Object.keys(map)).toEqual(["jollof-rice"]);
    expect(map["jollof-rice"]).not.toContain("_rollback");
  });

  // Regression: a stale .jpg from an earlier broken deploy must not win over
  // the canonical .webp the upload route now always writes.
  it("prefers the canonical .webp over a duplicate .jpg for the same id", () => {
    const webpFirst = buildImageMap([
      blob("meals/egusi-soup.webp", 1_700_000_000_000),
      blob("meals/egusi-soup.jpg", 1_700_000_500_000),
    ]);
    expect(webpFirst["egusi-soup"]).toContain("egusi-soup.webp");

    // Order-independent: .jpg listed first, .webp second.
    const jpgFirst = buildImageMap([
      blob("meals/egusi-soup.jpg", 1_700_000_000_000),
      blob("meals/egusi-soup.webp", 1_700_000_500_000),
    ]);
    expect(jpgFirst["egusi-soup"]).toContain("egusi-soup.webp");
  });

  it("accepts jpg/jpeg/png when no webp exists", () => {
    const map = buildImageMap([
      blob("meals/fried-rice.jpg"),
      blob("meals/suya.jpeg"),
      blob("meals/asun.png"),
    ]);
    expect(map["fried-rice"]).toContain("fried-rice.jpg");
    expect(map["suya"]).toContain("suya.jpeg");
    expect(map["asun"]).toContain("asun.png");
  });

  it("skips files without a recognised image extension", () => {
    const map = buildImageMap([
      blob("meals/notes.txt"),
      blob("meals/.keep"),
    ]);
    expect(map).toEqual({});
  });

  it("appends a cache-busting version from uploadedAt", () => {
    const map = buildImageMap([blob("meals/peppered-chicken.webp", 1_781_563_720_000)]);
    expect(map["peppered-chicken"]).toMatch(/\?v=1781563720000$/);
  });

  it("returns an empty map for no blobs", () => {
    expect(buildImageMap([])).toEqual({});
  });
});
