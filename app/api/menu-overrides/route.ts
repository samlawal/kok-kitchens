import { NextResponse } from "next/server";
import { getFolderBlobs } from "@/lib/blob-cache";
import { getDb, ensureSchema } from "@/lib/db";
import {
  gatherMenuOverrides,
  type CustomItemRow,
  type NameRow,
  type PriceRow,
  type StatusRow,
} from "@/lib/menu-overrides-server";

// GET — return all admin overrides the customer-facing menu needs:
// { prices: {id:number}, statuses: {id:status}, images: {id:url} }.
// The gathering logic (pagination + blob/DB isolation) lives in
// lib/menu-overrides-server.ts so it can be unit-tested without Next.
export async function GET() {
  const overrides = await gatherMenuOverrides({
    // One "page" from the cached folder listing (lib/blob-cache) — no
    // per-request Blob pagination.
    listPage: async () => {
      const blobs = await getFolderBlobs("meals");
      return { blobs, cursor: undefined, hasMore: false };
    },
    queryPrices: async () => {
      const sql = getDb();
      return (await ensureSchema(() => sql`
        SELECT menu_item_id, price FROM price_overrides
      `)) as PriceRow[];
    },
    queryStatuses: async () => {
      const sql = getDb();
      return (await ensureSchema(() => sql`
        SELECT menu_item_id, status FROM item_availability
      `)) as StatusRow[];
    },
    queryNames: async () => {
      const sql = getDb();
      return (await ensureSchema(() => sql`
        SELECT menu_item_id, name FROM item_name_overrides
      `)) as NameRow[];
    },
    queryCustomItems: async () => {
      const sql = getDb();
      return (await ensureSchema(() => sql`
        SELECT id, slug, name, description, price, category, image, spicy, servings
        FROM custom_menu_items
        ORDER BY created_at DESC
      `)) as CustomItemRow[];
    },
  });

  return NextResponse.json(
    { success: true, ...overrides },
    { headers: { "Cache-Control": "no-store" } }
  );
}
