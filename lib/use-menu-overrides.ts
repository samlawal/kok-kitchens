"use client";

import { useEffect, useState } from "react";
import { EMPTY_OVERRIDES, type MenuOverrides } from "./menu-overrides";

interface FetchLike {
  json: () => Promise<unknown>;
}

export interface OverridesStore {
  load: () => Promise<MenuOverrides>;
  getCache: () => MenuOverrides | null;
  subscribe: (cb: (o: MenuOverrides) => void) => () => void;
}

/**
 * Caching state machine behind useMenuOverrides, separated from React so it
 * can be unit-tested. Guarantees:
 * - a single in-flight request is shared across concurrent callers
 * - a successful response is cached for the session
 * - a failed/!success response is NOT cached, so a later call retries
 */
export function createOverridesStore(
  fetcher: () => Promise<FetchLike>
): OverridesStore {
  let cache: MenuOverrides | null = null;
  let inflight: Promise<MenuOverrides> | null = null;
  const subscribers = new Set<(o: MenuOverrides) => void>();

  function load(): Promise<MenuOverrides> {
    if (cache) return Promise.resolve(cache);
    if (inflight) return inflight;

    inflight = fetcher()
      .then((r) => r.json())
      .then((data) => {
        const d = data as
          | {
              success?: boolean;
              names?: unknown;
              prices?: unknown;
              statuses?: unknown;
              images?: unknown;
              customItems?: unknown;
            }
          | null;
        if (d?.success) {
          cache = {
            names: (d.names as MenuOverrides["names"]) || {},
            prices: (d.prices as MenuOverrides["prices"]) || {},
            statuses: (d.statuses as MenuOverrides["statuses"]) || {},
            images: (d.images as MenuOverrides["images"]) || {},
            customItems: (d.customItems as MenuOverrides["customItems"]) || [],
          };
          subscribers.forEach((cb) => cb(cache!));
          return cache!;
        }
        // Real failure — don't cache; allow a later mount to retry.
        inflight = null;
        return EMPTY_OVERRIDES;
      })
      .catch(() => {
        inflight = null;
        return EMPTY_OVERRIDES;
      });

    return inflight;
  }

  return {
    load,
    getCache: () => cache,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
  };
}

// Module singleton so every card / page shares one /api/menu-overrides fetch.
const store = createOverridesStore(() => fetch("/api/menu-overrides"));

/** Returns admin price/status/image overrides, fetched once per session. */
export function useMenuOverrides(): MenuOverrides {
  const [overrides, setOverrides] = useState<MenuOverrides>(
    store.getCache() || EMPTY_OVERRIDES
  );

  useEffect(() => {
    const cached = store.getCache();
    if (cached) {
      setOverrides(cached);
      return;
    }
    const unsubscribe = store.subscribe(setOverrides);
    store.load();
    return unsubscribe;
  }, []);

  return overrides;
}
