import { describe, it, expect } from "vitest";
import {
  hireItems,
  hireTotal,
  HIRE_CATEGORY_LABELS,
  HIRE_CATEGORY_ORDER,
} from "./hire-data";

describe("hire-data", () => {
  it("every item has a unique id, a name and a positive price", () => {
    const ids = new Set<string>();
    for (const item of hireItems) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.price).toBeGreaterThan(0);
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    }
  });

  it("every item's category is a known, labelled, ordered category", () => {
    for (const item of hireItems) {
      expect(HIRE_CATEGORY_LABELS[item.category]).toBeTruthy();
      expect(HIRE_CATEGORY_ORDER).toContain(item.category);
    }
  });

  it("excludes food/catering items (hire only)", () => {
    const names = hireItems.map((i) => i.name.toLowerCase()).join(" ");
    for (const food of ["stew", "gizzard", "oxtail"]) {
      expect(names).not.toContain(food);
    }
  });
});

describe("hireTotal", () => {
  it("sums price × quantity across selections", () => {
    const a = hireItems.find((i) => i.id === "charger-gold")!; // £3
    const b = hireItems.find((i) => i.id === "cutlery-set")!; // £1.80
    expect(hireTotal([{ item: a, quantity: 10 }, { item: b, quantity: 4 }])).toBeCloseTo(37.2, 5);
  });

  it("is zero for an empty list", () => {
    expect(hireTotal([])).toBe(0);
  });
});
