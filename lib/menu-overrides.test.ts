import { describe, it, expect } from "vitest";
import { resolveItem, EMPTY_OVERRIDES, type MenuOverrides } from "./menu-overrides";
import type { MenuItem } from "./types";

function makeItem(over: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "jollof-rice",
    slug: "jollof-rice",
    name: "Jollof Rice",
    description: "Smoky party jollof",
    price: 12,
    image: "/meals/jollof-rice.webp",
    category: "rice-dishes",
    tags: [],
    ...over,
  };
}

describe("resolveItem", () => {
  it("returns the static item unchanged when there are no overrides", () => {
    const item = makeItem();
    const resolved = resolveItem(item, EMPTY_OVERRIDES);
    expect(resolved.price).toBe(12);
    expect(resolved.image).toBe("/meals/jollof-rice.webp");
    expect(resolved.availability).toBe("available");
  });

  // Regression: admin price edits were stored but never reached the customer
  // menu (the page only read availability). resolveItem must apply the override.
  it("applies a price override", () => {
    const o: MenuOverrides = { prices: { "jollof-rice": 15.5 }, statuses: {}, images: {} };
    expect(resolveItem(makeItem(), o).price).toBe(15.5);
  });

  it("applies an availability status override", () => {
    const o: MenuOverrides = { prices: {}, statuses: { "jollof-rice": "unavailable" }, images: {} };
    expect(resolveItem(makeItem(), o).availability).toBe("unavailable");
  });

  it("applies an uploaded image override", () => {
    const url = "https://store.public.blob.vercel-storage.com/meals/jollof-rice.webp?v=1";
    const o: MenuOverrides = { prices: {}, statuses: {}, images: { "jollof-rice": url } };
    expect(resolveItem(makeItem(), o).image).toBe(url);
  });

  it("applies price, status and image together", () => {
    const o: MenuOverrides = {
      prices: { "jollof-rice": 20 },
      statuses: { "jollof-rice": "hidden" },
      images: { "jollof-rice": "https://blob/x.webp?v=9" },
    };
    const r = resolveItem(makeItem(), o);
    expect(r.price).toBe(20);
    expect(r.availability).toBe("hidden");
    expect(r.image).toBe("https://blob/x.webp?v=9");
  });

  it("only overrides the targeted item, leaving others on static values", () => {
    const o: MenuOverrides = { prices: { "fried-rice": 99 }, statuses: {}, images: {} };
    expect(resolveItem(makeItem({ id: "jollof-rice" }), o).price).toBe(12);
  });

  it("ignores a non-numeric price override and keeps the static price", () => {
    const o = { prices: { "jollof-rice": undefined }, statuses: {}, images: {} } as unknown as MenuOverrides;
    expect(resolveItem(makeItem(), o).price).toBe(12);
  });

  it("does not mutate the input item", () => {
    const item = makeItem();
    resolveItem(item, { prices: { "jollof-rice": 30 }, statuses: {}, images: {} });
    expect(item.price).toBe(12);
  });
});
