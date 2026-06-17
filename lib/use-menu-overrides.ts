"use client";

import { useEffect, useState } from "react";
import { EMPTY_OVERRIDES, type MenuOverrides } from "./menu-overrides";

// Singleton cache so every card / page shares a single /api/menu-overrides
// fetch (price + status + image overrides) rather than each hitting the API.
let cache: MenuOverrides | null = null;
let inflight: Promise<MenuOverrides> | null = null;
const subscribers = new Set<(o: MenuOverrides) => void>();

function load(): Promise<MenuOverrides> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = fetch("/api/menu-overrides")
    .then((r) => r.json())
    .then((data) => {
      if (data?.success) {
        cache = {
          prices: data.prices || {},
          statuses: data.statuses || {},
          images: data.images || {},
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

/** Returns admin price/status/image overrides, fetched once per session. */
export function useMenuOverrides(): MenuOverrides {
  const [overrides, setOverrides] = useState<MenuOverrides>(cache || EMPTY_OVERRIDES);

  useEffect(() => {
    if (cache) {
      setOverrides(cache);
      return;
    }
    let active = true;
    const cb = (next: MenuOverrides) => {
      if (active) setOverrides(next);
    };
    subscribers.add(cb);
    load();
    return () => {
      active = false;
      subscribers.delete(cb);
    };
  }, []);

  return overrides;
}
