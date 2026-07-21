import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSql = vi.hoisted(() => {
  const fn = vi.fn() as ReturnType<typeof vi.fn> & {
    __tagged: ReturnType<typeof vi.fn>;
  };
  fn.__tagged = fn;
  return fn;
});

vi.mock("@/lib/db", () => ({
  getDb: () =>
    // Tagged-template calls go through the function itself:
    // sql`SELECT ...` → mockSql(strings, ...values)
    mockSql,
  // Passthrough — the heal path has its own tests (lib/db-ensure-schema.test.ts)
  ensureSchema: (op: () => Promise<unknown>) => op(),
}));

vi.mock("@vercel/blob", () => ({
  put: vi.fn(async () => ({ url: "https://blob/meals/test.webp" })),
}));

import { GET, POST, DELETE } from "./route";

const PW = "kok-admin-2026";

function jsonReq(method: string, body: object) {
  return new Request("http://test/api/custom-items", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: empty custom_menu_items table
  mockSql.mockResolvedValue([]);
});

// ── GET ──────────────────────────────────────────────────────

describe("GET /api/custom-items", () => {
  it("returns items from the database", async () => {
    const rows = [
      {
        id: "custom-chin-chin",
        slug: "chin-chin",
        name: "Chin Chin",
        description: "Crunchy snack",
        price: 8,
        category: "snacks",
        image: "",
        spicy: false,
        servings: null,
      },
    ];
    mockSql.mockResolvedValueOnce(rows);

    const res = await GET();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.items).toEqual(rows);
  });

  it("coerces string prices from Neon NUMERIC to numbers (bug-2026-07-21)", async () => {
    // Neon returns NUMERIC columns as strings; the admin Menu tab then called
    // formatPrice(price).toFixed() and crashed the whole /admin subtree. GET
    // must hand back a numeric price.
    mockSql.mockResolvedValueOnce([
      {
        id: "custom-x",
        slug: "x",
        name: "X",
        description: "",
        price: "12.00",
        category: "snacks",
        image: "",
        spicy: false,
        servings: null,
      },
    ]);
    const res = await GET();
    const data = await res.json();
    expect(data.items[0].price).toBe(12);
    expect(typeof data.items[0].price).toBe("number");
  });

  it("returns empty array on DB failure (graceful degradation)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSql.mockRejectedValueOnce(new Error("db down"));

    const res = await GET();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.items).toEqual([]);
    spy.mockRestore();
  });
});

// ── POST ─────────────────────────────────────────────────────

describe("POST /api/custom-items", () => {
  it("rejects with 401 on wrong password", async () => {
    const res = await POST(
      jsonReq("POST", {
        password: "wrong",
        name: "Test",
        price: 10,
        category: "snacks",
      })
    );
    expect(res.status).toBe(401);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("rejects with 400 when name is missing", async () => {
    const res = await POST(
      jsonReq("POST", { password: PW, name: "", price: 10, category: "snacks" })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toMatch(/Name.*required/i);
  });

  it("rejects with 400 when category is missing", async () => {
    const res = await POST(
      jsonReq("POST", { password: PW, name: "Test", price: 10, category: "" })
    );
    expect(res.status).toBe(400);
  });

  it("rejects with 400 when price is negative", async () => {
    const res = await POST(
      jsonReq("POST", {
        password: PW,
        name: "Test",
        price: -5,
        category: "snacks",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects with 400 when name produces an empty slug", async () => {
    const res = await POST(
      jsonReq("POST", {
        password: PW,
        name: "!!!",
        price: 10,
        category: "snacks",
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toMatch(/letter or number/i);
  });

  it("creates a custom item with correct slug and id", async () => {
    // First call: SELECT slug FROM custom_menu_items → []
    // Second call: INSERT → success
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const res = await POST(
      jsonReq("POST", {
        password: PW,
        name: "Chin Chin",
        description: "Crunchy fried dough",
        price: 8,
        category: "snacks",
        spicy: false,
      })
    );
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.item.slug).toBe("chin-chin");
    expect(data.item.id).toBe("custom-chin-chin");
    expect(data.item.name).toBe("Chin Chin");
    expect(data.item.price).toBe(8);
    expect(data.item.category).toBe("snacks");
    expect(data.message).toMatch(/Added "Chin Chin"/);
  });

  it("appends -2 suffix when slug collides with existing custom item", async () => {
    // SELECT slug → existing slug "chin-chin"
    mockSql.mockResolvedValueOnce([{ slug: "chin-chin" }]);
    // INSERT → success
    mockSql.mockResolvedValueOnce([]);

    const res = await POST(
      jsonReq("POST", {
        password: PW,
        name: "Chin Chin",
        price: 10,
        category: "snacks",
      })
    );
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.item.slug).toBe("chin-chin-2");
    expect(data.item.id).toBe("custom-chin-chin-2");
  });

  it("returns 500 on DB insert failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    // SELECT slug → []
    mockSql.mockResolvedValueOnce([]);
    // INSERT → throws
    mockSql.mockRejectedValueOnce(new Error("unique constraint"));

    const res = await POST(
      jsonReq("POST", {
        password: PW,
        name: "Test Item",
        price: 5,
        category: "drinks",
      })
    );
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.message).toMatch(/unique constraint/);
    spy.mockRestore();
  });
});

// ── DELETE ────────────────────────────────────────────────────

describe("DELETE /api/custom-items", () => {
  it("rejects with 401 on wrong password", async () => {
    const res = await DELETE(
      jsonReq("DELETE", { password: "wrong", itemId: "custom-x" })
    );
    expect(res.status).toBe(401);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("rejects with 400 when itemId is missing", async () => {
    const res = await DELETE(jsonReq("DELETE", { password: PW }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toMatch(/itemId.*required/i);
  });

  it("returns 404 when item does not exist", async () => {
    mockSql.mockResolvedValueOnce([]);
    const res = await DELETE(
      jsonReq("DELETE", { password: PW, itemId: "custom-nope" })
    );
    expect(res.status).toBe(404);
  });

  it("deletes an existing item and returns its name", async () => {
    mockSql.mockResolvedValueOnce([{ name: "Chin Chin" }]);
    const res = await DELETE(
      jsonReq("DELETE", { password: PW, itemId: "custom-chin-chin" })
    );
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/Removed "Chin Chin"/);
  });

  it("returns 500 on DB failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSql.mockRejectedValueOnce(new Error("db down"));
    const res = await DELETE(
      jsonReq("DELETE", { password: PW, itemId: "custom-x" })
    );
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});
