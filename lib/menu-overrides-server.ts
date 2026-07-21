import { buildImageMap, type BlobLike } from "./blob-images";
import type { Availability, MenuOverrides } from "./menu-overrides";
import type { MenuItem } from "./types";
import {
  mapCustomItemRow,
  customItemToMenuItem,
  type CustomItemRow,
} from "./custom-items";

// Re-exported so existing importers (app/api/menu-overrides/route.ts) keep working.
export type { CustomItemRow };

export interface BlobPage {
  blobs: BlobLike[];
  cursor?: string;
  hasMore: boolean;
}

export interface PriceRow {
  menu_item_id: string;
  price: number | string;
}

export interface StatusRow {
  menu_item_id: string;
  status: string;
}

export interface NameRow {
  menu_item_id: string;
  name: string;
}

export interface OverridesDeps {
  listPage: (cursor?: string) => Promise<BlobPage>;
  queryPrices: () => Promise<PriceRow[]>;
  queryStatuses: () => Promise<StatusRow[]>;
  queryNames: () => Promise<NameRow[]>;
  queryCustomItems: () => Promise<CustomItemRow[]>;
}

// Run an override query in isolation: a single failing/missing table returns
// empty for THAT slice only, never blanking the others. Bug BVY0TOg7M3c: the
// four DB queries used to share one try/catch, so a missing custom_menu_items
// (42P01) collapsed every price + name override on the live menu.
async function safeQuery<T>(
  fn: () => Promise<T>,
  label: string,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`menu-overrides: ${label} query failed:`, error);
    return fallback;
  }
}

/**
 * Gather name/price/status/image overrides for the customer menu.
 *
 * - pages through all blobs (Vercel Blob list() caps at 1000 per call)
 * - every lookup is isolated (blob + each of the four DB queries): one failing
 *   returns empty for that slice rather than blanking the others
 */
export async function gatherMenuOverrides(
  deps: OverridesDeps
): Promise<MenuOverrides> {
  const names: Record<string, string> = {};
  const prices: Record<string, number> = {};
  const statuses: Record<string, Availability> = {};
  let images: Record<string, string> = {};
  let customItems: MenuItem[] = [];

  // Uploaded photos (Vercel Blob) — independent of the database.
  try {
    const blobs: BlobLike[] = [];
    let cursor: string | undefined;
    do {
      const page = await deps.listPage(cursor);
      blobs.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    images = buildImageMap(blobs);
  } catch (error) {
    console.error("menu-overrides: blob list failed:", error);
  }

  // Name + price + availability overrides + custom items (database). Each query
  // is isolated (safeQuery) so a single missing/failing table cannot blank the
  // others — the whole reason Taiwo's £60 goat price never reached the live menu.
  const [nameRows, priceRows, statusRows, customRows] = await Promise.all([
    safeQuery(deps.queryNames, "names", [] as NameRow[]),
    safeQuery(deps.queryPrices, "prices", [] as PriceRow[]),
    safeQuery(deps.queryStatuses, "statuses", [] as StatusRow[]),
    safeQuery(deps.queryCustomItems, "customItems", [] as CustomItemRow[]),
  ]);
  for (const row of nameRows) {
    names[row.menu_item_id] = row.name;
  }
  for (const row of priceRows) {
    prices[row.menu_item_id] = Number(row.price);
  }
  for (const row of statusRows) {
    statuses[row.menu_item_id] = row.status as Availability;
  }
  // Coerce (esp. price) via the shared mapper, then adapt to the public MenuItem
  // shape — one coercion point for the whole app (D-006).
  customItems = customRows.map((row) => customItemToMenuItem(mapCustomItemRow(row)));

  return { names, prices, statuses, images, customItems };
}
