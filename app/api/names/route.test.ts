import { describe, it, expect, vi, beforeEach } from "vitest";

// Covers bug bug-2026-07-19-BVY0TOg7M3c: Taiwo renamed "Goat Meat Stew" AND
// repriced it in one save. handleSave() is all-or-nothing across /api/pricing +
// /api/names, so a name-save 500 (item_name_overrides missing in prod, same
// 42P01 class as DRBfP9SOiPY) surfaced as "Failed to save" even though the
// price call succeeded. Fix: wrap the name-override DB ops in ensureSchema.

const mockSql = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  getDb: () => mockSql,
  // Passthrough — the heal path itself is covered by lib/db-ensure-schema.test.ts.
  ensureSchema: (op: () => Promise<unknown>) => op(),
}));

import { GET, POST, DELETE } from "./route";

const PW = "kok-admin-2026";

function jsonReq(method: string, body: object) {
  return new Request("http://test/api/names", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockSql.mockResolvedValue([]);
});

// ── GET ──────────────────────────────────────────────────────

describe("GET /api/names", () => {
  it("returns overrides from the database", async () => {
    const rows = [{ menu_item_id: "goat-meat-stew", name: "Goat meat", updated_at: "2026-07-19" }];
    mockSql.mockResolvedValueOnce(rows);

    const res = await GET();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.overrides).toEqual(rows);
  });

  it("returns empty overrides with 500 on DB failure (graceful degradation)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSql.mockRejectedValueOnce(new Error("db down"));

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.overrides).toEqual([]);
    spy.mockRestore();
  });
});

// ── POST ─────────────────────────────────────────────────────

describe("POST /api/names", () => {
  it("rejects with 401 on wrong password", async () => {
    const res = await POST(jsonReq("POST", { password: "wrong", updates: [{ menuItemId: "x", name: "Y" }] }));
    expect(res.status).toBe(401);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("rejects with 400 when updates is empty", async () => {
    const res = await POST(jsonReq("POST", { password: PW, updates: [] }));
    expect(res.status).toBe(400);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("renames an item and reports the count", async () => {
    const res = await POST(
      jsonReq("POST", { password: PW, updates: [{ menuItemId: "goat-meat-stew", name: "Goat meat" }] })
    );
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.updated).toBe(1);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("skips blank and over-long names without touching the DB", async () => {
    const longName = "x".repeat(121);
    const res = await POST(
      jsonReq("POST", {
        password: PW,
        updates: [
          { menuItemId: "a", name: "   " },
          { menuItemId: "b", name: longName },
        ],
      })
    );
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.updated).toBe(0);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 500 when the name save fails (Taiwo's exact symptom)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSql.mockRejectedValueOnce(new Error("relation does not exist"));

    const res = await POST(
      jsonReq("POST", { password: PW, updates: [{ menuItemId: "goat-meat-stew", name: "Goat meat" }] })
    );
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.success).toBe(false);
    spy.mockRestore();
  });
});

// ── DELETE ────────────────────────────────────────────────────

describe("DELETE /api/names", () => {
  it("rejects with 401 on wrong password", async () => {
    const res = await DELETE(jsonReq("DELETE", { password: "wrong", menuItemId: "goat-meat-stew" }));
    expect(res.status).toBe(401);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("resets an override to the code default", async () => {
    const res = await DELETE(jsonReq("DELETE", { password: PW, menuItemId: "goat-meat-stew" }));
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("returns 500 on DB failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSql.mockRejectedValueOnce(new Error("db down"));
    const res = await DELETE(jsonReq("DELETE", { password: PW, menuItemId: "goat-meat-stew" }));
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});
