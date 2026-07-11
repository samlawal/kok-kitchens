import { buildImageMap, type BlobLike } from "./blob-images";
import type { Availability, MenuOverrides } from "./menu-overrides";
import type { MenuItem } from "./types";

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

export interface CustomItemRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image: string;
  spicy: boolean;
  servings: string | null;
}

export interface OverridesDeps {
  listPage: (cursor?: string) => Promise<BlobPage>;
  queryPrices: () => Promise<PriceRow[]>;
  queryStatuses: () => Promise<StatusRow[]>;
  queryNames: () => Promise<NameRow[]>;
  queryCustomItems: () => Promise<CustomItemRow[]>;
}

/**
 * Gather name/price/status/image overrides for the customer menu.
 *
 * - pages through all blobs (Vercel Blob list() caps at 1000 per call)
 * - blob and DB lookups are isolated: one failing returns empty for that
 *   slice rather than blanking the other
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

  // Name + price + availability overrides + custom items (database).
  try {
    const [nameRows, priceRows, statusRows, customRows] = await Promise.all([
      deps.queryNames(),
      deps.queryPrices(),
      deps.queryStatuses(),
      deps.queryCustomItems(),
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
    customItems = customRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      category: row.category as MenuItem["category"],
      image: row.image,
      spicy: row.spicy,
      servings: row.servings || undefined,
      tags: [],
    }));
  } catch (error) {
    console.error("menu-overrides: db query failed:", error);
  }

  return { names, prices, statuses, images, customItems };
}
