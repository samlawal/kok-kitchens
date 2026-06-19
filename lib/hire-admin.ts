// Pure, testable validation for admin hire operations (set stock, clear stock,
// change a booking's status). Kept free of DB/network so the rules can be unit
// tested; the route does only the SQL after this returns ok.

export const HIRE_BOOKING_STATUSES = [
  "enquiry",
  "confirmed",
  "out",
  "returned",
  "closed",
  "cancelled",
] as const;
export type HireBookingStatus = (typeof HIRE_BOOKING_STATUSES)[number];

export type HireAdminOp =
  | { ok: true; op: "setStock"; itemId: string; totalQty: number }
  | { ok: true; op: "deleteStock"; itemId: string }
  | { ok: true; op: "setStatus"; id: number; status: HireBookingStatus }
  | { ok: false; status: number; message: string };

// Validate one admin hire request body against the known item ids.
export function validateHireAdminOp(
  body: Record<string, unknown>,
  validItemIds: Set<string>
): HireAdminOp {
  const op = body?.op;

  if (op === "setStock") {
    const itemId = String(body.itemId ?? "");
    const n = Number(body.totalQty);
    if (!validItemIds.has(itemId) || !Number.isFinite(n) || n < 0) {
      return { ok: false, status: 400, message: "Invalid item or quantity" };
    }
    // Whole units only; floor any decimals.
    return { ok: true, op: "setStock", itemId, totalQty: Math.floor(n) };
  }

  if (op === "deleteStock") {
    const itemId = String(body.itemId ?? "");
    if (!validItemIds.has(itemId)) {
      return { ok: false, status: 400, message: "Invalid item" };
    }
    return { ok: true, op: "deleteStock", itemId };
  }

  if (op === "setStatus") {
    const id = Number(body.id);
    const status = String(body.status ?? "");
    if (
      !Number.isInteger(id) ||
      !HIRE_BOOKING_STATUSES.includes(status as HireBookingStatus)
    ) {
      return { ok: false, status: 400, message: "Invalid booking or status" };
    }
    return { ok: true, op: "setStatus", id, status: status as HireBookingStatus };
  }

  return { ok: false, status: 400, message: "Unknown operation" };
}
