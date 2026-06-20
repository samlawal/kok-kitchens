import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

// GET — fetch all price overrides
export async function GET() {
  try {
    const sql = getDb();
    const overrides = await sql`
      SELECT menu_item_id, price, updated_at
      FROM price_overrides
      ORDER BY updated_at DESC
    `;
    return NextResponse.json({ success: true, overrides });
  } catch (error) {
    console.error("Failed to fetch price overrides:", error);
    return NextResponse.json(
      { success: false, overrides: [] },
      { status: 500 }
    );
  }
}

// POST — update prices (batch)
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
        { success: false, message: "No price updates provided" },
        { status: 400 }
      );
    }

    const sql = getDb();
    let updated = 0;

    for (const { menuItemId, price } of updates) {
      if (!menuItemId || typeof price !== "number" || price < 0) continue;

      await sql`
        INSERT INTO price_overrides (menu_item_id, price, updated_at)
        VALUES (${menuItemId}, ${price}, NOW())
        ON CONFLICT (menu_item_id)
        DO UPDATE SET price = ${price}, updated_at = NOW()
      `;
      updated++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} price${updated !== 1 ? "s" : ""}`,
      updated,
    });
  } catch (error) {
    console.error("Failed to update prices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update prices" },
      { status: 500 }
    );
  }
}

// DELETE — remove a price override (revert to code default)
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
    await sql`DELETE FROM price_overrides WHERE menu_item_id = ${menuItemId}`;

    return NextResponse.json({
      success: true,
      message: `Reset ${menuItemId} to default price`,
    });
  } catch (error) {
    console.error("Failed to delete override:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset price" },
      { status: 500 }
    );
  }
}
