import { describe, it, expect, vi } from "vitest";
import { createOverridesStore } from "./use-menu-overrides";

type Fetcher = () => Promise<{ json: () => Promise<unknown> }>;

function okResponse(body: unknown) {
  return { json: async () => body };
}

describe("createOverridesStore", () => {
  // Fix: every card/page shares one fetch rather than each hitting the API.
  it("shares a single in-flight request across concurrent loads", async () => {
    let resolveJson!: (v: unknown) => void;
    const jsonPromise = new Promise<unknown>((res) => (resolveJson = res));
    const fetcher = vi.fn(() => Promise.resolve({ json: () => jsonPromise }));
    const store = createOverridesStore(fetcher as unknown as Fetcher);

    const p1 = store.load();
    const p2 = store.load();
    const p3 = store.load();
    expect(fetcher).toHaveBeenCalledTimes(1);

    resolveJson({ success: true, prices: { a: 1 }, names: {}, statuses: {}, images: {}, customItems: [] });
    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    expect(r1).toEqual(r2);
    expect(r2).toEqual(r3);
    expect(r1.prices).toEqual({ a: 1 });
  });

  it("caches a successful response and does not refetch", async () => {
    const fetcher = vi.fn(async () =>
      okResponse({ success: true, prices: { a: 2 }, names: {}, statuses: {}, images: {}, customItems: [] })
    );
    const store = createOverridesStore(fetcher as unknown as Fetcher);

    await store.load();
    expect(store.getCache()).toEqual({ prices: { a: 2 }, names: {}, statuses: {}, images: {}, customItems: [] });
    await store.load();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("notifies subscribers on success", async () => {
    const fetcher = vi.fn(async () =>
      okResponse({ success: true, prices: {}, names: {}, statuses: { x: "hidden" }, images: {}, customItems: [] })
    );
    const store = createOverridesStore(fetcher as unknown as Fetcher);
    const cb = vi.fn();
    store.subscribe(cb);

    await store.load();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].statuses).toEqual({ x: "hidden" });
  });

  // Fix: a transient failure must not cache an empty map for the whole session.
  it("does not cache a non-success response and retries on next load", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(okResponse({ success: false }))
      .mockResolvedValueOnce(
        okResponse({ success: true, prices: { a: 3 }, names: {}, statuses: {}, images: {}, customItems: [] })
      );
    const store = createOverridesStore(fetcher as unknown as Fetcher);

    const first = await store.load();
    expect(first).toEqual({ names: {}, prices: {}, statuses: {}, images: {}, customItems: [] });
    expect(store.getCache()).toBeNull();

    const second = await store.load();
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(second.prices).toEqual({ a: 3 });
  });

  it("recovers from a rejected fetch without caching", async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(
        okResponse({ success: true, prices: { a: 4 }, names: {}, statuses: {}, images: {}, customItems: [] })
      );
    const store = createOverridesStore(fetcher as unknown as Fetcher);

    const first = await store.load();
    expect(first).toEqual({ names: {}, prices: {}, statuses: {}, images: {}, customItems: [] });
    expect(store.getCache()).toBeNull();

    const second = await store.load();
    expect(second.prices).toEqual({ a: 4 });
  });
});
