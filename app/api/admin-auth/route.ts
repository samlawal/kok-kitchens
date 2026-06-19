import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kok-admin-2026";

// POST /api/admin-auth { password } — used by the admin login screen to verify
// the password up front, so a wrong/whitespace-padded password is caught at
// sign-in (where the field is) instead of failing later on every action.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (verifyAdminPassword(body?.password, ADMIN_PASSWORD)) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json(
    { success: false, message: "Invalid password" },
    { status: 401 }
  );
}
