// Pure, testable validation for a catering quote enquiry.
//
// Kept free of DB/network so it can be unit-tested and reused by the
// /api/catering-enquiry route. Covers shape (name/phone/email required), a real
// event date that isn't in the past, and a sensible guest count. `today` is
// injectable so the date checks are time-independent in tests.

import { isRealIsoDate } from "@/lib/hire-validation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CateringInput {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  eventDate?: unknown;
  guestCount?: unknown;
  eventType?: unknown;
  details?: unknown;
}

export type CateringValidation =
  | { ok: false; status: number; message: string }
  | {
      ok: true;
      name: string;
      phone: string;
      email: string;
      eventIso: string;
      guestCount: number;
      eventType: string;
      details: string;
    };

export function validateCateringEnquiry(
  input: CateringInput,
  opts: { today?: string } = {}
): CateringValidation {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";

  if (!name || !phone || !email) {
    return { ok: false, status: 400, message: "Name, phone and email are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, status: 400, message: "Enter a valid email address." };
  }

  const rawDate = typeof input.eventDate === "string" ? input.eventDate.trim() : "";
  if (!rawDate) {
    return { ok: false, status: 400, message: "Please choose an event date." };
  }
  if (!isRealIsoDate(rawDate)) {
    return { ok: false, status: 400, message: "Enter a valid event date." };
  }
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  if (rawDate < today) {
    return { ok: false, status: 400, message: "The event date can’t be in the past." };
  }

  const guestCount = Number(input.guestCount);
  if (!Number.isFinite(guestCount) || guestCount < 1) {
    return { ok: false, status: 400, message: "Enter the number of guests." };
  }

  const eventType =
    typeof input.eventType === "string" && input.eventType.trim()
      ? input.eventType.trim()
      : "other";
  const details = typeof input.details === "string" ? input.details.trim() : "";

  return {
    ok: true,
    name,
    phone,
    email,
    eventIso: rawDate,
    guestCount: Math.floor(guestCount),
    eventType,
    details,
  };
}
