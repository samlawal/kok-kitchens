import type { MenuItem } from "./types";

export type Availability = "available" | "unavailable" | "hidden";

// Admin overrides applied on top of the static menu (lib/menu-data.ts):
// price edits, availability status, and uploaded photos. All keyed by item id.
export interface MenuOverrides {
  prices: Record<string, number>;
  statuses: Record<string, Availability>;
  images: Record<string, string>;
}

export const EMPTY_OVERRIDES: MenuOverrides = {
  prices: {},
  statuses: {},
  images: {},
};

/**
 * Apply admin overrides to a static menu item. Pure — same item + overrides
 * always yields the same result, so it's safe to call repeatedly (e.g. once at
 * the page level for filtering and again inside each card).
 */
export function resolveItem(item: MenuItem, o: MenuOverrides): MenuItem {
  const price = o.prices[item.id];
  const status = o.statuses[item.id];
  const image = o.images[item.id];
  return {
    ...item,
    ...(typeof price === "number" && { price }),
    availability: status || item.availability || "available",
    ...(image && { image }),
  };
}
