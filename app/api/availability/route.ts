import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kok-admin-2026";
const VALID_STATUSES = ["available", "unavailable", "hidden"] as const;

// GET — fetch all availability overrides
export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT menu_item_id, status, updated_at
      FROM item_availability
      ORDER BY updated_at DESC
    `;
    return NextResponse.json({ success: true, items: rows });
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    return NextResponse.json(
      { success: true, items: [] },
      { status: 200 }
    );
  }
}

// POST — update availability for one or more items
export async function POST(request: Request) {
  try {
    const { password, updates } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "No availability updates provided" },
        { status: 400 }
      );
    }

    const sql = getDb();
    let updated = 0;

    for (const { menuItemId, status } of updates) {
      if (!menuItemId || !VALID_STATUSES.includes(status)) continue;

      if (status === "available") {
        // Remove the override — default is available
        await sql`DELETE FROM item_availability WHERE menu_item_id = ${menuItemId}`;
      } else {
        await sql`
          INSERT INTO item_availability (menu_item_id, status, updated_at)
          VALUES (${menuItemId}, ${status}, NOW())
          ON CONFLICT (menu_item_id)
          DO UPDATE SET status = ${status}, updated_at = NOW()
        `;
      }
      updated++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} item${updated !== 1 ? "s" : ""}`,
      updated,
    });
  } catch (error) {
    console.error("Failed to update availability:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update availability" },
      { status: 500 }
    );
  }
}
