import type { MenuItem } from "./types";

export type Availability = "available" | "unavailable" | "hidden";

// Admin overrides applied on top of the static menu (lib/menu-data.ts):
// name edits, price edits, availability status, and uploaded photos. All
// keyed by item id.
export interface MenuOverrides {
  names: Record<string, string>;
  prices: Record<string, number>;
  statuses: Record<string, Availability>;
  images: Record<string, string>;
  customItems: MenuItem[];
}

export const EMPTY_OVERRIDES: MenuOverrides = {
  names: {},
  prices: {},
  statuses: {},
  images: {},
  customItems: [],
};

/**
 * Apply admin overrides to a static menu item. Pure — same item + overrides
 * always yields the same result, so it's safe to call repeatedly (e.g. once at
 * the page level for filtering and again inside each card).
 *
 * Blank/whitespace-only name overrides fall back to the code default rather
 * than blanking the menu item — belt-and-braces against an accidental save.
 */
export function resolveItem(item: MenuItem, o: MenuOverrides): MenuItem {
  const rawName = o.names[item.id];
  const name =
    typeof rawName === "string" && rawName.trim() ? rawName.trim() : undefined;
  const price = o.prices[item.id];
  const status = o.statuses[item.id];
  const image = o.images[item.id];
  return {
    ...item,
    ...(name && { name }),
    ...(typeof price === "number" && { price }),
    availability: status || item.availability || "available",
    ...(image && { image }),
  };
}
