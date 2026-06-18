import { NextResponse } from "next/server";
import { parseGetAddress, isGetAddressConfigured } from "@/lib/address";

// GET /api/address?postcode=WD7+8PQ — returns full addresses at a postcode via
// getAddress.io. The API key stays server-side. Degrades gracefully: without a
// key (or on any error) it returns success:false + [] so the checkout simply
// falls back to manual address entry.
export async function GET(request: Request) {
  const postcode = (new URL(request.url).searchParams.get("postcode") || "").trim();
  if (!postcode) {
    return NextResponse.json({ success: false, addresses: [] }, { status: 400 });
  }

  if (!isGetAddressConfigured()) {
    return NextResponse.json({ success: false, configured: false, addresses: [] });
  }

  try {
    const key = process.env.GETADDRESS_API_KEY!;
    const res = await fetch(
      `https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${encodeURIComponent(key)}&expand=true&sort=true`
    );
    if (!res.ok) {
      // 404 = no addresses for that postcode; anything else = lookup problem.
      return NextResponse.json({ success: false, addresses: [] });
    }
    const data = await res.json();
    return NextResponse.json(
      { success: true, addresses: parseGetAddress(data) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Address lookup failed:", error);
    return NextResponse.json({ success: false, addresses: [] });
  }
}
