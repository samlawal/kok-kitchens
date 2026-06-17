"use client";

import { useEffect, useState } from "react";

// Singleton cache so every MealCard / detail page shares a single
// /api/images fetch rather than each component hitting the endpoint.
let cache: Record<string, string> | null = null;
let inflight: Promise<Record<string, string>> | null = null;
const subscribers = new Set<(m: Record<string, string>) => void>();

function load(): Promise<Record<string, string>> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = fetch("/api/images")
    .then((r) => r.json())
    .then((data) => {
      if (data?.success) {
        cache = data.images || {};
        subscribers.forEach((cb) => cb(cache!));
        return cache!;
      }
      // Real failure — don't cache; allow a later mount to retry.
      inflight = null;
      return {};
    })
    .catch(() => {
      inflight = null;
      return {};
    });

  return inflight;
}

/** Returns a map of { menuItemId: blobUrl } for admin-uploaded photos. */
export function useUploadedImages(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>(cache || {});

  useEffect(() => {
    if (cache) {
      setMap(cache);
      return;
    }
    let active = true;
    const cb = (m: Record<string, string>) => {
      if (active) setMap(m);
    };
    subscribers.add(cb);
    load();
    return () => {
      active = false;
      subscribers.delete(cb);
    };
  }, []);

  return map;
}
