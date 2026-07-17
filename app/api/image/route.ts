import { NextResponse } from "next/server";
import { getFolderBlobs } from "@/lib/blob-cache";

// Resolves dish image: checks Blob first, falls back to static.
// Uses the cached folder listing (lib/blob-cache) instead of a list() per
// request — this route alone was the project's biggest advanced-ops burner.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const blobs = await getFolderBlobs("meals");
    const match = blobs.find((b) => b.pathname === `meals/${id}.webp`);

    if (match) {
      // Redirect to Blob URL (cached by browser + CDN)
      return NextResponse.redirect(match.url, 302);
    }
  } catch {
    // Blob not configured — fall through to static
  }

  // Fall back to static file
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/meals/${id}.webp`, 302);
}
