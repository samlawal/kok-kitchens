import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

// One-time setup: hit GET /api/init to create the orders table
export async function GET() {
  try {
    await initDb();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error) {
    console.error("DB init failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize database", error: String(error) },
      { status: 500 }
    );
  }
}
