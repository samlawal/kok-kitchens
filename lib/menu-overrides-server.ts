import { buildImageMap, type BlobLike } from "./blob-images";
import type { Availability, MenuOverrides } from "./menu-overrides";

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

export interface OverridesDeps {
  listPage: (cursor?: string) => Promise<BlobPage>;
  queryPrices: () => Promise<PriceRow[]>;
  queryStatuses: () => Promise<StatusRow[]>;
}

/**
 * Gather price/status/image overrides for the customer menu.
 *
 * - pages through all blobs (Vercel Blob list() caps at 1000 per call)
 * - blob and DB lookups are isolated: one failing returns empty for that
 *   slice rather than blanking the other
 */
export async function gatherMenuOverrides(
  deps: OverridesDeps
): Promise<MenuOverrides> {
  const prices: Record<string, number> = {};
  const statuses: Record<string, Availability> = {};
  let images: Record<string, string> = {};

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

  // Price + availability overrides (database).
  try {
    const [priceRows, statusRows] = await Promise.all([
      deps.queryPrices(),
      deps.queryStatuses(),
    ]);
    for (const row of priceRows) {
      prices[row.menu_item_id] = Number(row.price);
    }
    for (const row of statusRows) {
      statuses[row.menu_item_id] = row.status as Availability;
    }
  } catch (error) {
    console.error("menu-overrides: db query failed:", error);
  }

  return { prices, statuses, images };
}
