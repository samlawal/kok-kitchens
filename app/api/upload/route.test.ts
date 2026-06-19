import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Vercel Blob layer so we can drive the route through every undo path
// without touching real storage. (vi.hoisted so the factory can see it.)
const blob = vi.hoisted(() => ({
  put: vi.fn(),
  list: vi.fn(),
  del: vi.fn(),
}));
vi.mock("@vercel/blob", () => blob);

import { PUT } from "./route";

const PW = "kok-admin-2026";

function undo(body: object) {
  return new Request("http://test/api/upload", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// list() is called twice: once for the rollback copy, once for the current blob.
function listWith(rollback: boolean, current: boolean) {
  blob.list.mockImplementation((opts: { prefix: string }) =>
    Promise.resolve({
      blobs: opts.prefix.includes("_rollback")
        ? rollback
          ? [{ url: "https://blob/meals/_rollback/jollof.webp" }]
          : []
        : current
          ? [{ url: "https://blob/meals/jollof.webp" }]
          : [],
    })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  blob.put.mockResolvedValue({ url: "https://blob/meals/jollof.webp" });
  blob.del.mockResolvedValue(undefined);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      headers: { get: () => "image/webp" },
      arrayBuffer: async () => new ArrayBuffer(8),
    }))
  );
});

describe("PUT /api/upload — Undo last change", () => {
  it("restores the previous version when a rollback copy exists", async () => {
    listWith(true, true);
    const res = await PUT(undo({ password: PW, menuItemId: "jollof", type: "meals" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/Restored the previous photo/);
    expect(blob.put).toHaveBeenCalledTimes(1); // wrote the restored image back
    expect(blob.del).toHaveBeenCalledWith("https://blob/meals/_rollback/jollof.webp"); // cleared the rollback
  });

  it("deletes the upload (back to default) when there is no rollback — the recurring bug", async () => {
    listWith(false, true);
    const res = await PUT(undo({ password: PW, menuItemId: "jollof", type: "meals" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.reverted).toBe("default");
    expect(blob.del).toHaveBeenCalledWith("https://blob/meals/jollof.webp"); // removed the upload
    expect(blob.put).not.toHaveBeenCalled(); // nothing restored
  });

  it("returns 404 when nothing is uploaded", async () => {
    listWith(false, false);
    const res = await PUT(undo({ password: PW, menuItemId: "jollof", type: "meals" }));
    expect(res.status).toBe(404);
    expect((await res.json()).message).toMatch(/Nothing to undo/);
    expect(blob.del).not.toHaveBeenCalled();
  });

  it("rejects a wrong password with 401 and never touches storage", async () => {
    const res = await PUT(undo({ password: "wrong", menuItemId: "jollof", type: "meals" }));
    expect(res.status).toBe(401);
    expect(blob.list).not.toHaveBeenCalled();
    expect(blob.del).not.toHaveBeenCalled();
    expect(blob.put).not.toHaveBeenCalled();
  });

  it("tolerates a whitespace-padded password (same fix as the login bug)", async () => {
    listWith(false, true);
    const res = await PUT(undo({ password: `${PW} `, menuItemId: "jollof", type: "meals" }));
    expect(res.status).toBe(200);
  });
});
