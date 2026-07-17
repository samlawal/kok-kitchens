import { NextResponse } from "next/server";
import { getFolderBlobs } from "@/lib/blob-cache";
import { buildImageMap } from "@/lib/blob-images";

// GET — { hireItemId: blobUrl } for admin-uploaded hire photos. Mirrors
// /api/menu-overrides' image handling, but on the "hire/" folder.
// Served from the cached folder listing (lib/blob-cache).
export async function GET() {
  try {
    const blobs = await getFolderBlobs("hire");
    return NextResponse.json(
      { success: true, images: buildImageMap(blobs, "hire/") },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to list hire images:", error);
    return NextResponse.json({ success: false, images: {} }, { status: 200 });
  }
}
