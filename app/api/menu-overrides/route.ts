import { NextResponse } from "next/server";
import { list, type ListBlobResultBlob } from "@vercel/blob";
import { getDb } from "@/lib/db";
import { buildImageMap } from "@/lib/blob-images";
import type { Availability } from "@/lib/menu-overrides";

// GET — return all admin overrides the customer-facing menu needs:
// { prices: {id:number}, statuses: {id:status}, images: {id:url} }.
// Blob and DB lookups are isolated so one failing doesn't blank the other.
export async function GET() {
  const prices: Record<string, number> = {};
  const statuses: Record<string, Availability> = {};
  let images: Record<string, string> = {};

  // Uploaded photos (Vercel Blob) — independent of the database.
  try {
    const blobs: ListBlobResultBlob[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: "meals/", cursor, limit: 1000 });
      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    images = buildImageMap(blobs);
  } catch (error) {
    console.error("menu-overrides: blob list failed:", error);
  }

  // Price + availability overrides (Neon).
  try {
    const sql = getDb();
    const [priceRows, statusRows] = await Promise.all([
      sql`SELECT menu_item_id, price FROM price_overrides`,
      sql`SELECT menu_item_id, status FROM item_availability`,
    ]);
    for (const row of priceRows) {
      prices[row.menu_item_id as string] = Number(row.price);
    }
    for (const row of statusRows) {
      statuses[row.menu_item_id as string] = row.status as Availability;
    }
  } catch (error) {
    console.error("menu-overrides: db query failed:", error);
  }

  return NextResponse.json(
    { success: true, prices, statuses, images },
    { headers: { "Cache-Control": "no-store" } }
  );
}
