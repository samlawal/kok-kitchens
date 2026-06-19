import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

// Admin-protected read-only view of recent orders — lets us confirm a card
// order flipped to paid after the Stripe webhook fired. No customer PII here.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kok-admin-2026";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!verifyAdminPassword(password, ADMIN_PASSWORD)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT ref, payment_method, payment_status, total, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `;
    return NextResponse.json(
      { success: true, orders: rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: detail },
      { status: 500 }
    );
  }
}

// DELETE — remove specific orders by ref (admin only). Deletes only the exact
// refs passed, never a blanket wipe, so it can't catch an unrelated order.
export async function DELETE(request: Request) {
  const { password, refs } = await request.json();
  if (!verifyAdminPassword(password, ADMIN_PASSWORD)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }
  if (!Array.isArray(refs) || refs.length === 0) {
    return NextResponse.json(
      { success: false, message: "Provide an array of order refs to delete" },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();
    const deleted: string[] = [];
    for (const ref of refs) {
      const rows = await sql`DELETE FROM orders WHERE ref = ${ref} RETURNING ref`;
      if (rows.length > 0) deleted.push(ref);
    }
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: detail },
      { status: 500 }
    );
  }
}
