// Date-ranged availability for equipment hire.
//
// Hire is NOT a simple stock decrement: an item booked for an event is only
// unavailable for *overlapping* dates, then it returns to the pool. So the
// quantity a customer can hire for a given window is:
//
//   available = total owned − units already held by overlapping bookings
//
// "Held" means a booking whose status keeps stock out of the pool (a live
// enquiry/soft-hold, a confirmed booking, items still out, or items returned
// but not yet cleaned) AND whose hire window overlaps the requested window.
// A turnaround buffer keeps an item unavailable for a day or two after its
// return so it can be cleaned/checked before re-hire.
//
// Everything here is pure (no DB, no I/O) so it can be unit-tested and reused
// by both the availability API and the booking-validation path.

export interface BookingItem {
  item_id: string;
  quantity: number;
}

export interface HireBooking {
  status: string;
  /** YYYY-MM-DD */
  hire_out_date: string;
  /** YYYY-MM-DD */
  return_date: string;
  items: BookingItem[];
  /** ISO timestamp; only meaningful for `enquiry` (soft-hold) bookings. */
  hold_expires_at?: string | null;
}

export interface AvailabilityRow {
  total: number;
  booked: number;
  available: number;
}

// Days an item stays unavailable after its return_date (cleaning/turnaround).
export const TURNAROUND_BUFFER_DAYS = 1;

// Booking statuses that keep stock out of the available pool.
export const HOLDING_STATUSES = new Set([
  "enquiry",
  "confirmed",
  "out",
  "returned",
]);

// Add `n` whole days to a YYYY-MM-DD date, returning YYYY-MM-DD. Uses UTC so it
// never drifts across daylight-saving boundaries.
export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Two inclusive date ranges overlap when each starts on or before the other
// ends. ISO YYYY-MM-DD strings compare correctly lexicographically.
export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

// Does this booking currently keep stock out of the pool? A soft-hold enquiry
// only counts while its hold has not expired.
export function bookingHoldsStock(b: HireBooking, nowMs: number): boolean {
  if (!HOLDING_STATUSES.has(b.status)) return false;
  if (b.status === "enquiry" && b.hold_expires_at) {
    return new Date(b.hold_expires_at).getTime() > nowMs;
  }
  return true;
}

// Per-item availability for a requested [from, to] window (inclusive). Only
// items present in `inventory` are stock-managed; callers should treat items
// without an inventory row as unmanaged (no cap).
export function computeAvailability(
  inventory: Record<string, number>,
  bookings: HireBooking[],
  from: string,
  to: string,
  opts: { nowMs?: number; bufferDays?: number } = {}
): Record<string, AvailabilityRow> {
  const nowMs = opts.nowMs ?? Date.now();
  const buffer = opts.bufferDays ?? TURNAROUND_BUFFER_DAYS;

  const booked: Record<string, number> = {};
  for (const b of bookings) {
    if (!bookingHoldsStock(b, nowMs)) continue;
    // A booking blocks its hire window plus the turnaround buffer after return.
    const blockedEnd = addDays(b.return_date, buffer);
    if (!rangesOverlap(b.hire_out_date, blockedEnd, from, to)) continue;
    for (const it of b.items) {
      const qty = Number(it.quantity) || 0;
      if (qty <= 0) continue;
      booked[it.item_id] = (booked[it.item_id] || 0) + qty;
    }
  }

  const rows: Record<string, AvailabilityRow> = {};
  for (const [item_id, total] of Object.entries(inventory)) {
    const bk = booked[item_id] || 0;
    rows[item_id] = { total, booked: bk, available: Math.max(0, total - bk) };
  }
  return rows;
}

// Convenience: available units for one item, or null if the item is not
// stock-managed (no inventory row). Used by the booking-validation path.
export function availableForItem(
  itemId: string,
  inventory: Record<string, number>,
  bookings: HireBooking[],
  from: string,
  to: string,
  opts: { nowMs?: number; bufferDays?: number } = {}
): number | null {
  if (!(itemId in inventory)) return null;
  const rows = computeAvailability(inventory, bookings, from, to, opts);
  return rows[itemId]?.available ?? null;
}
