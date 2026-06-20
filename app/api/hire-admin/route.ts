import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { hireItems } from "@/lib/hire-data";
import { validateHireAdminOp } from "@/lib/hire-admin";

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

// GET /api/hire-admin → stock counts + bookings for the admin panel. The admin
// password travels in the `x-admin-password` header (never the query string),
// so it can't leak into access logs, proxies or browser history.
export async function GET(request: Request) {
  if (!verifyAdminSecret(request.headers.get("x-admin-password"))) {
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
  if (!verifyAdminSecret(body.password)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  // Validate the op + arguments (pure, unit-tested in lib/hire-admin.test.ts)
  // before touching the database.
  const result = validateHireAdminOp(body, validItemIds);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.status }
    );
  }

  try {
    const sql = getDb();

    if (result.op === "setStock") {
      await sql`
        INSERT INTO hire_inventory (item_id, total_qty, updated_at)
        VALUES (${result.itemId}, ${result.totalQty}, NOW())
        ON CONFLICT (item_id) DO UPDATE SET total_qty = ${result.totalQty}, updated_at = NOW()
      `;
      return NextResponse.json({ success: true, itemId: result.itemId, totalQty: result.totalQty });
    }

    if (result.op === "deleteStock") {
      // Removing the row makes the item "unmanaged" again (no stock cap shown).
      await sql`DELETE FROM hire_inventory WHERE item_id = ${result.itemId}`;
      return NextResponse.json({ success: true, itemId: result.itemId, deleted: true });
    }

    // result.op === "setStatus"
    await sql`UPDATE hire_bookings SET status = ${result.status}, updated_at = NOW() WHERE id = ${result.id}`;
    return NextResponse.json({ success: true, id: result.id, status: result.status });
  } catch (error) {
    console.error("hire-admin POST failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Failed: ${detail}` },
      { status: 500 }
    );
  }
}
