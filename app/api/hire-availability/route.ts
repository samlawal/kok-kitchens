import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { computeAvailability, type HireBooking } from "@/lib/hire-availability";

export const dynamic = "force-dynamic";

interface InventoryRow {
  item_id: string;
  total_qty: number;
}
interface BookingRow {
  status: string;
  hire_out_date: string | Date;
  return_date: string | Date;
  items: unknown;
  hold_expires_at: string | Date | null;
}

function isoDate(s: string | null): string | null {
  return s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}
function toIsoDate(v: string | Date): string {
  // DATE columns can arrive as a local-midnight Date; format by LOCAL parts so
  // UTC conversion never shifts the calendar day. (Queries also cast to text.)
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = `${v.getMonth() + 1}`.padStart(2, "0");
    const d = `${v.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v).slice(0, 10);
}

// GET /api/hire-availability?date=YYYY-MM-DD  (or ?from=&to=)
// Returns per-item availability for stock-managed hire items in that window.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = isoDate(searchParams.get("date"));
  const from = isoDate(searchParams.get("from")) || date;
  const to = isoDate(searchParams.get("to")) || date || from;

  if (!from || !to) {
    return NextResponse.json(
      { success: false, message: "Provide a valid date (YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();

    const invRows = (await sql`
      SELECT item_id, total_qty FROM hire_inventory
    `) as unknown as InventoryRow[];
    const inventory: Record<string, number> = {};
    for (const r of invRows) inventory[r.item_id] = Number(r.total_qty);

    const bookingRows = (await sql`
      SELECT status,
             hire_out_date::text AS hire_out_date,
             return_date::text AS return_date,
             items, hold_expires_at
      FROM hire_bookings
      WHERE status IN ('enquiry', 'confirmed', 'out', 'returned')
    `) as unknown as BookingRow[];

    const bookings: HireBooking[] = bookingRows.map((r) => ({
      status: r.status,
      hire_out_date: toIsoDate(r.hire_out_date),
      return_date: toIsoDate(r.return_date),
      items: Array.isArray(r.items)
        ? (r.items as HireBooking["items"])
        : [],
      hold_expires_at: r.hold_expires_at
        ? new Date(r.hold_expires_at).toISOString()
        : null,
    }));

    const managed = computeAvailability(inventory, bookings, from, to);
    return NextResponse.json(
      { success: true, from, to, managed },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    // Tables may not exist yet, or DB unreachable — degrade gracefully so the
    // catalogue still works (no managed items == no caps shown).
    console.error("hire-availability failed:", error);
    return NextResponse.json({ success: true, from, to, managed: {} });
  }
}
