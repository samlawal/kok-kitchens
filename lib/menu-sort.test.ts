import { describe, it, expect } from "vitest";
import { sortMenuForDisplay } from "./menu-sort";
import { menuItems } from "./menu-data";
import type { MenuItem } from "./types";

function make(id: string, name: string, category: string): MenuItem {
  return {
    id,
    slug: id,
    name,
    description: "",
    price: 10,
    image: "",
    category: category as MenuItem["category"],
  };
}

describe("sortMenuForDisplay", () => {
  it("orders items A–Z within each category", () => {
    const sorted = sortMenuForDisplay(menuItems);
    const byCat = new Map<string, string[]>();
    for (const item of sorted) {
      if (!byCat.has(item.category)) byCat.set(item.category, []);
      byCat.get(item.category)!.push(item.name);
    }
    for (const [, names] of byCat) {
      const alpha = [...names].sort((a, b) =>
        a.localeCompare(b, "en", { sensitivity: "base" })
      );
      expect(names).toEqual(alpha);
    }
  });

  it("keeps categories in their canonical (source) order", () => {
    const canonical = Array.from(new Set(menuItems.map((i) => i.category)));
    const seen: string[] = [];
    for (const item of sortMenuForDisplay(menuItems)) {
      if (!seen.includes(item.category)) seen.push(item.category);
    }
    expect(seen).toEqual(canonical);
  });

  it("sorts by the admin-renamed name when one is set", () => {
    const cat = menuItems[0].category;
    const inCat = menuItems.filter((i) => i.category === cat);
    // Rename the alphabetically-first item to force it last.
    const target = [...inCat].sort((a, b) => a.name.localeCompare(b.name))[0];
    const sorted = sortMenuForDisplay(inCat, { [target.id]: "zzz last" });
    expect(sorted[sorted.length - 1].id).toBe(target.id);
  });

  it("does not mutate the input array", () => {
    const input = [make("b", "Banana", "rice-dishes"), make("a", "Apple", "rice-dishes")];
    const copy = [...input];
    sortMenuForDisplay(input);
    expect(input).toEqual(copy);
  });
});
