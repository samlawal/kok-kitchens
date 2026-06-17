import { NextResponse } from "next/server";
import { list, type ListBlobResultBlob } from "@vercel/blob";
import { buildImageMap } from "@/lib/blob-images";

// GET — return a map of { menuItemId: blobUrl } for every admin-uploaded photo.
// Mirrors /api/availability: the menu page fetches this on mount and overrides
// the static image path baked into menu-data.ts.
export async function GET() {
  try {
    // Page through all blobs — list() caps at 1000 per call.
    const blobs: ListBlobResultBlob[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: "meals/", cursor, limit: 1000 });
      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    return NextResponse.json(
      { success: true, images: buildImageMap(blobs) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to list blob images:", error);
    // success:false lets the client distinguish a real failure from "no uploads"
    // so it can retry rather than caching an empty map for the session.
    return NextResponse.json({ success: false, images: {} }, { status: 200 });
  }
}
