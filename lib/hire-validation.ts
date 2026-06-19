// Pure, testable validation for a hire enquiry/booking request.
//
// Kept free of DB/network so it can be unit-tested and reused by the
// /api/hire-enquiry route. Availability/oversell checks happen separately
// (they need the DB) — this covers shape, item resolution, and the event date
// (format + not-in-the-past), and resolves authoritative names/prices from the
// catalogue rather than trusting the client.

export interface RawEnquiryItem {
  id: string;
  quantity: unknown;
}

export interface EnquiryInput {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  eventDate?: unknown;
  notes?: unknown;
  items?: unknown;
}

export interface CatalogueItem {
  id: string;
  name: string;
  price: number;
}

export interface EnquiryLine {
  id: string;
  name: string;
  price: number;
  qty: number;
  line: number;
}

export type EnquiryValidation =
  | { ok: false; status: number; message: string }
  | { ok: true; lines: EnquiryLine[]; total: number; eventIso: string | null };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Is `s` a real calendar date in YYYY-MM-DD (rejects e.g. 2026-13-40)?
export function isRealIsoDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function validateHireEnquiry(
  input: EnquiryInput,
  catalogue: CatalogueItem[],
  opts: { today?: string } = {}
): EnquiryValidation {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const items = Array.isArray(input.items) ? (input.items as RawEnquiryItem[]) : [];

  if (!name || !phone || items.length === 0) {
    return {
      ok: false,
      status: 400,
      message: "Name, phone and at least one item are required",
    };
  }

  // Resolve items against the catalogue; drop unknown ids and non-positive qty.
  const byId = new Map(catalogue.map((i) => [i.id, i]));
  const lines: EnquiryLine[] = [];
  for (const { id, quantity } of items) {
    const it = byId.get(id);
    const qty = Number(quantity);
    if (!it || !Number.isFinite(qty) || qty <= 0) continue;
    lines.push({ id: it.id, name: it.name, price: it.price, qty, line: it.price * qty });
  }
  if (lines.length === 0) {
    return { ok: false, status: 400, message: "No valid hire items selected" };
  }

  // Event date is optional, but when supplied it must be a real date and not
  // in the past. `today` is injectable so tests are time-independent.
  let eventIso: string | null = null;
  const rawDate = typeof input.eventDate === "string" ? input.eventDate.trim() : "";
  if (rawDate) {
    if (!isRealIsoDate(rawDate)) {
      return { ok: false, status: 400, message: "Enter a valid event date." };
    }
    const today = opts.today ?? new Date().toISOString().slice(0, 10);
    if (rawDate < today) {
      return { ok: false, status: 400, message: "The event date can’t be in the past." };
    }
    eventIso = rawDate;
  }

  const total = lines.reduce((s, l) => s + l.line, 0);
  return { ok: true, lines, total, eventIso };
}
