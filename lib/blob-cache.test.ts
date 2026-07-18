// Covers bug-2026-07-17-DRBfP9SOiPY: admin "add new item" saves errored
// because the account blew its Blob advanced-ops quota — every image lookup
// and menu render issued list() calls. The fix routes ALL folder listings
// through lib/blob-cache. These tests exercise that path with a mocked
// @vercel/blob: full cursor pagination, field mapping, and bustBlobCache
// surviving outside the Next runtime. (TTL caching itself is Next's
// unstable_cache — verified on staging, not unit-testable here.)
import { describe, it, expect, vi, beforeEach } from "vitest";

const listMock = vi.fn();
vi.mock("@vercel/blob", () => ({ list: (...args: unknown[]) => listMock(...args) }));

// unstable_cache needs Next's incremental cache — passthrough here so the
// test exercises the listing logic; revalidateTag is spied to assert busting.
const revalidateTagMock = vi.fn();
vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
  revalidateTag: (...args: unknown[]) => revalidateTagMock(...args),
}));

import { getFolderBlobs, bustBlobCache } from "./blob-cache";

beforeEach(() => {
  listMock.mockReset();
  revalidateTagMock.mockReset();
});

describe("getFolderBlobs", () => {
  it("paginates the full folder and maps pathname/url/uploadedAt", async () => {
    listMock
      .mockResolvedValueOnce({
        blobs: [{ pathname: "meals/jollof.webp", url: "https://blob/x.webp", uploadedAt: new Date("2026-07-01T00:00:00Z") }],
        hasMore: true,
        cursor: "c1",
      })
      .mockResolvedValueOnce({
        blobs: [{ pathname: "meals/egusi.webp", url: "https://blob/y.webp", uploadedAt: "2026-07-02T00:00:00Z" }],
        hasMore: false,
      });

    const blobs = await getFolderBlobs("meals");

    expect(blobs).toEqual([
      { pathname: "meals/jollof.webp", url: "https://blob/x.webp", uploadedAt: "2026-07-01T00:00:00.000Z" },
      { pathname: "meals/egusi.webp", url: "https://blob/y.webp", uploadedAt: "2026-07-02T00:00:00Z" },
    ]);
    // both pages fetched, cursor threaded through
    expect(listMock).toHaveBeenCalledTimes(2);
    expect(listMock.mock.calls[1][0]).toMatchObject({ prefix: "meals/", cursor: "c1" });
  });
});

describe("bustBlobCache", () => {
  it("expires the folder's cache tag immediately (uploads must appear instantly)", () => {
    bustBlobCache("meals");
    expect(revalidateTagMock).toHaveBeenCalledWith("blobs-meals", "max");
  });

  it("never throws when revalidateTag fails outside the Next runtime", () => {
    revalidateTagMock.mockImplementation(() => {
      throw new Error("no runtime");
    });
    expect(() => bustBlobCache("meals")).not.toThrow();
  });
});
