import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSql = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({
  getDb: () => mockSql,
  ensureSchema: (op: () => Promise<unknown>) => op(),
}));

import {
  mapCustomItemRow,
  customItemToMenuItem,
  getCustomItems,
  getCustomItemBySlug,
  type CustomItemRow,
} from "./custom-items";

const row = (over: Partial<CustomItemRow> = {}): CustomItemRow => ({
  id: "custom-x",
  slug: "x",
  name: "X",
  description: "",
  price: "55.00", // Neon returns NUMERIC as a string — the whole point
  category: "snacks",
  image: "",
  spicy: false,
  servings: null,
  ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockSql.mockResolvedValue([]);
});

describe("mapCustomItemRow", () => {
  it("coerces a string price to a number", () => {
    const item = mapCustomItemRow(row({ price: "55.00" }));
    expect(item.price).toBe(55);
    expect(typeof item.price).toBe("number");
  });

  it("leaves a numeric price untouched", () => {
    expect(mapCustomItemRow(row({ price: 8.5 })).price).toBe(8.5);
  });

  it("normalises a null image to empty string", () => {
    expect(mapCustomItemRow(row({ image: "" })).image).toBe("");
  });
});

describe("customItemToMenuItem", () => {
  it("adds empty tags and drops null servings", () => {
    const mi = customItemToMenuItem(mapCustomItemRow(row({ price: "5", servings: null })));
    expect(mi.tags).toEqual([]);
    expect(mi.servings).toBeUndefined();
    expect(mi.price).toBe(5);
  });
});

describe("getCustomItems", () => {
  it("returns coerced items (string price -> number)", async () => {
    mockSql.mockResolvedValueOnce([row({ price: "55.00" })]);
    const items = await getCustomItems();
    expect(items[0].price).toBe(55);
    expect(typeof items[0].price).toBe("number");
  });
});

describe("getCustomItemBySlug", () => {
  it("returns a coerced item", async () => {
    mockSql.mockResolvedValueOnce([row({ price: "12.00" })]);
    expect((await getCustomItemBySlug("x"))?.price).toBe(12);
  });

  it("returns null when not found", async () => {
    mockSql.mockResolvedValueOnce([]);
    expect(await getCustomItemBySlug("nope")).toBeNull();
  });

  it("returns null (never throws) on a DB error", async () => {
    mockSql.mockRejectedValueOnce(new Error("db down"));
    expect(await getCustomItemBySlug("x")).toBeNull();
  });
});
