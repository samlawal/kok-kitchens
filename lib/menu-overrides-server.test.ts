import { describe, it, expect, vi } from "vitest";
import {
  gatherMenuOverrides,
  type BlobPage,
  type OverridesDeps,
} from "./menu-overrides-server";

function blob(pathname: string, ms = 1_700_000_000_000) {
  return { pathname, url: `https://blob/${pathname}`, uploadedAt: new Date(ms) };
}

function deps(over: Partial<OverridesDeps> = {}): OverridesDeps {
  return {
    listPage: async () => ({ blobs: [], hasMore: false }),
    queryPrices: async () => [],
    queryStatuses: async () => [],
    queryNames: async () => [],
    queryCustomItems: async () => [],
    ...over,
  };
}

describe("gatherMenuOverrides", () => {
  it("merges prices, statuses and images", async () => {
    const r = await gatherMenuOverrides(
      deps({
        listPage: async () => ({
          blobs: [blob("meals/jollof-rice.webp")],
          hasMore: false,
        }),
        queryPrices: async () => [{ menu_item_id: "jollof-rice", price: 15 }],
        queryStatuses: async () => [
          { menu_item_id: "egusi-soup", status: "unavailable" },
        ],
      })
    );
    expect(r.prices).toEqual({ "jollof-rice": 15 });
    expect(r.statuses).toEqual({ "egusi-soup": "unavailable" });
    expect(r.images["jollof-rice"]).toContain("meals/jollof-rice.webp");
  });

  // Regression: renaming an item required a code deploy because the override
  // system had no name channel. gatherMenuOverrides must include names.
  it("merges name overrides alongside prices/statuses/images", async () => {
    const r = await gatherMenuOverrides(
      deps({
        queryNames: async () => [
          { menu_item_id: "tiger-nut", name: "Tiger Nut Drink" },
        ],
      })
    );
    expect(r.names).toEqual({ "tiger-nut": "Tiger Nut Drink" });
  });

  it("isolates a DB failure — names also empty, images still return", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await gatherMenuOverrides(
      deps({
        listPage: async () => ({
          blobs: [blob("meals/tiger-nut.webp")],
          hasMore: false,
        }),
        queryNames: async () => {
          throw new Error("db down");
        },
      })
    );
    expect(r.names).toEqual({});
    expect(r.images["tiger-nut"]).toContain("tiger-nut.webp");
    spy.mockRestore();
  });

  it("coerces string prices to numbers", async () => {
    const r = await gatherMenuOverrides(
      deps({ queryPrices: async () => [{ menu_item_id: "x", price: "12.50" }] })
    );
    expect(r.prices.x).toBe(12.5);
  });

  // Regression: list() caps at 1000 blobs per call; the gatherer must page
  // through until hasMore is false or items past the first page vanish.
  it("pages through all blobs until hasMore is false", async () => {
    const pages: BlobPage[] = [
      { blobs: [blob("meals/a.webp")], cursor: "c1", hasMore: true },
      { blobs: [blob("meals/b.webp")], cursor: "c2", hasMore: true },
      { blobs: [blob("meals/c.webp")], hasMore: false },
    ];
    const listPage = vi.fn(async (cursor?: string) => {
      if (!cursor) return pages[0];
      if (cursor === "c1") return pages[1];
      return pages[2];
    });
    const r = await gatherMenuOverrides(deps({ listPage }));
    expect(listPage).toHaveBeenCalledTimes(3);
    expect(Object.keys(r.images).sort()).toEqual(["a", "b", "c"]);
  });

  it("isolates a blob failure — still returns DB overrides", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await gatherMenuOverrides(
      deps({
        listPage: async () => {
          throw new Error("blob down");
        },
        queryPrices: async () => [{ menu_item_id: "x", price: 9 }],
      })
    );
    expect(r.images).toEqual({});
    expect(r.prices).toEqual({ x: 9 });
    spy.mockRestore();
  });

  it("maps custom item rows to MenuItem objects", async () => {
    const r = await gatherMenuOverrides(
      deps({
        queryCustomItems: async () => [
          {
            id: "custom-chin-chin",
            slug: "chin-chin",
            name: "Chin Chin",
            description: "Crunchy snack",
            price: "8.00",
            category: "snacks",
            image: "https://blob/meals/chin-chin.webp",
            spicy: false,
            servings: "Small bag",
          },
        ],
      })
    );
    expect(r.customItems).toHaveLength(1);
    const item = r.customItems[0];
    expect(item.id).toBe("custom-chin-chin");
    expect(item.slug).toBe("chin-chin");
    expect(item.name).toBe("Chin Chin");
    expect(item.price).toBe(8);
    expect(item.category).toBe("snacks");
    expect(item.tags).toEqual([]);
    expect(item.servings).toBe("Small bag");
  });

  it("returns empty customItems when DB fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await gatherMenuOverrides(
      deps({
        queryCustomItems: async () => {
          throw new Error("db down");
        },
      })
    );
    expect(r.customItems).toEqual([]);
    spy.mockRestore();
  });

  it("isolates a DB failure — still returns images", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await gatherMenuOverrides(
      deps({
        listPage: async () => ({
          blobs: [blob("meals/jollof-rice.webp")],
          hasMore: false,
        }),
        queryPrices: async () => {
          throw new Error("db down");
        },
      })
    );
    expect(r.prices).toEqual({});
    expect(r.statuses).toEqual({});
    expect(r.images["jollof-rice"]).toContain("jollof-rice.webp");
    spy.mockRestore();
  });
});
