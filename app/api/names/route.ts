import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

// Name overrides let the owner rename any menu item without a code deploy —
// mirrors the /api/pricing shape so the admin UI can reuse the batched-save
// pattern. Blank/whitespace strings are rejected server-side so a slip-of-the-
// finger save doesn't blank an item's name.

const MAX_NAME_LEN = 120;

function cleanName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_NAME_LEN) return null;
  return trimmed;
}

// GET — fetch all name overrides
export async function GET() {
  try {
    const sql = getDb();
    const overrides = await sql`
      SELECT menu_item_id, name, updated_at
      FROM item_name_overrides
      ORDER BY updated_at DESC
    `;
    return NextResponse.json({ success: true, overrides });
  } catch (error) {
    console.error("Failed to fetch name overrides:", error);
    return NextResponse.json(
      { success: false, overrides: [] },
      { status: 500 }
    );
  }
}

// POST — update names (batch)
export async function POST(request: Request) {
  try {
    const { password, updates } = await request.json();

    if (!verifyAdminSecret(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "No name updates provided" },
        { status: 400 }
      );
    }

    const sql = getDb();
    let updated = 0;

    for (const { menuItemId, name } of updates) {
      if (!menuItemId || typeof menuItemId !== "string") continue;
      const clean = cleanName(name);
      if (!clean) continue;

      await sql`
        INSERT INTO item_name_overrides (menu_item_id, name, updated_at)
        VALUES (${menuItemId}, ${clean}, NOW())
        ON CONFLICT (menu_item_id)
        DO UPDATE SET name = ${clean}, updated_at = NOW()
      `;
      updated++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} name${updated !== 1 ? "s" : ""}`,
      updated,
    });
  } catch (error) {
    console.error("Failed to update names:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update names" },
      { status: 500 }
    );
  }
}

// DELETE — remove a name override (revert to code default)
export async function DELETE(request: Request) {
  try {
    const { password, menuItemId } = await request.json();

    if (!verifyAdminSecret(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const sql = getDb();
    await sql`DELETE FROM item_name_overrides WHERE menu_item_id = ${menuItemId}`;

    return NextResponse.json({
      success: true,
      message: `Reset ${menuItemId} to default name`,
    });
  } catch (error) {
    console.error("Failed to delete name override:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset name" },
      { status: 500 }
    );
  }
}
