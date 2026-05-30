import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

// Resolves dish image: checks Blob first, falls back to static
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    // Check Vercel Blob for an uploaded version
    const result = await list({ prefix: `meals/${id}.webp` });
    const match = result.blobs.find(
      (b) => b.pathname === `meals/${id}.webp`
    );

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
