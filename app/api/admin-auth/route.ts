import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/admin-auth";

// POST /api/admin-auth { password } — used by the admin login screen to verify
// the password up front, so a wrong/whitespace-padded password is caught at
// sign-in (where the field is) instead of failing later on every action.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (verifyAdminSecret(body?.password)) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json(
    { success: false, message: "Invalid password" },
    { status: 401 }
  );
}
