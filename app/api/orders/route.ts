import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // TODO: save to Supabase once credentials are configured
  console.log("New order received:", JSON.stringify(body, null, 2));

  return NextResponse.json(
    { success: true, message: "Order received" },
    { status: 201 }
  );
}
