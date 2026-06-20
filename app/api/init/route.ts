import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { verifyAdminSecret } from "@/lib/admin-auth";

// One-time setup: creates/upgrades the database tables (idempotent).
// Admin-gated so it can't be triggered by anyone — pass the admin password in
// the `x-admin-password` header, or as `?key=` for a quick browser run, e.g.
//   curl -H "x-admin-password: <ADMIN_PASSWORD>" https://kokkitchens.com/api/init
export async function GET(request: Request) {
  const provided =
    request.headers.get("x-admin-password") ??
    new URL(request.url).searchParams.get("key");
  if (!verifyAdminSecret(provided)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await initDb();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error) {
    // Log full detail server-side; don't leak schema/driver internals to clients.
    console.error("DB init failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
