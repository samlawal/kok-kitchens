import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { hireItems } from "@/lib/hire-data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kok-admin-2026";
const VALID_STATUSES = new Set([
  "enquiry",
  "confirmed",
  "out",
  "returned",
  "closed",
  "cancelled",
]);
const validItemIds = new Set(hireItems.map((i) => i.id));

interface InvRow {
  item_id: string;
  total_qty: number;
}

function toIsoDate(v: unknown): string {
  // Format DATE values by LOCAL parts so UTC conversion can't shift the day.
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = `${v.getMonth() + 1}`.padStart(2, "0");
    const d = `${v.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v).slice(0, 10);
}
function toIso(v: unknown): string | null {
  if (!v) return null;
  return v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString();
}

// GET /api/hire-admin?password=  → stock counts + bookings for the admin panel.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!verifyAdminPassword(searchParams.get("password"), ADMIN_PASSWORD)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  try {
    const sql = getDb();
    const invRows = (await sql`
      SELECT item_id, total_qty FROM hire_inventory
    `) as unknown as InvRow[];
    const inventory: Record<string, number> = {};
    for (const r of invRows) inventory[r.item_id] = Number(r.total_qty);

    const bookingRows = (await sql`
      SELECT id, ref, customer_name, customer_phone, customer_email,
             hire_out_date::text AS hire_out_date,
             return_date::text AS return_date,
             items, status, hold_expires_at, created_at
      FROM hire_bookings
      ORDER BY (status IN ('closed', 'cancelled')) ASC, hire_out_date ASC, created_at DESC
      LIMIT 200
    `) as unknown as Record<string, unknown>[];

    const bookings = bookingRows.map((r) => ({
      id: Number(r.id),
      ref: String(r.ref),
      customerName: String(r.customer_name),
      customerPhone: String(r.customer_phone),
      customerEmail: r.customer_email ? String(r.customer_email) : null,
      hireOutDate: toIsoDate(r.hire_out_date),
      returnDate: toIsoDate(r.return_date),
      items: Array.isArray(r.items) ? r.items : [],
      status: String(r.status),
      holdExpiresAt: toIso(r.hold_expires_at),
      createdAt: toIso(r.created_at),
    }));

    return NextResponse.json(
      { success: true, inventory, bookings },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("hire-admin GET failed:", error);
    return NextResponse.json({
      success: true,
      inventory: {},
      bookings: [],
      warning: "Hire tables not initialised yet — run /api/init.",
    });
  }
}

// POST /api/hire-admin  { password, op: "setStock" | "setStatus", ... }
export async function POST(request: Request) {
  const body = await request.json();
  if (!verifyAdminPassword(body.password, ADMIN_PASSWORD)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  try {
    const sql = getDb();

    if (body.op === "setStock") {
      const itemId = String(body.itemId || "");
      const n = Number(body.totalQty);
      if (!validItemIds.has(itemId) || !Number.isFinite(n) || n < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid item or quantity" },
          { status: 400 }
        );
      }
      const totalQty = Math.floor(n);
      await sql`
        INSERT INTO hire_inventory (item_id, total_qty, updated_at)
        VALUES (${itemId}, ${totalQty}, NOW())
        ON CONFLICT (item_id) DO UPDATE SET total_qty = ${totalQty}, updated_at = NOW()
      `;
      return NextResponse.json({ success: true, itemId, totalQty });
    }

    if (body.op === "deleteStock") {
      const itemId = String(body.itemId || "");
      if (!validItemIds.has(itemId)) {
        return NextResponse.json(
          { success: false, message: "Invalid item" },
          { status: 400 }
        );
      }
      // Removing the row makes the item "unmanaged" again (no stock cap shown).
      await sql`DELETE FROM hire_inventory WHERE item_id = ${itemId}`;
      return NextResponse.json({ success: true, itemId, deleted: true });
    }

    if (body.op === "setStatus") {
      const id = Number(body.id);
      const status = String(body.status || "");
      if (!Number.isInteger(id) || !VALID_STATUSES.has(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid booking or status" },
          { status: 400 }
        );
      }
      await sql`UPDATE hire_bookings SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
      return NextResponse.json({ success: true, id, status });
    }

    return NextResponse.json(
      { success: false, message: "Unknown operation" },
      { status: 400 }
    );
  } catch (error) {
    console.error("hire-admin POST failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Failed: ${detail}` },
      { status: 500 }
    );
  }
}
