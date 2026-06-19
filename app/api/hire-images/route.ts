import { NextResponse } from "next/server";
import { list, type ListBlobResultBlob } from "@vercel/blob";
import { buildImageMap } from "@/lib/blob-images";

// GET — { hireItemId: blobUrl } for admin-uploaded hire photos. Mirrors
// /api/menu-overrides' image handling, but on the "hire/" folder.
export async function GET() {
  try {
    const blobs: ListBlobResultBlob[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: "hire/", cursor, limit: 1000 });
      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    return NextResponse.json(
      { success: true, images: buildImageMap(blobs, "hire/") },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to list hire images:", error);
    return NextResponse.json({ success: false, images: {} }, { status: 200 });
  }
}
