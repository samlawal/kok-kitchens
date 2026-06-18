// Lightweight customer-input validation for the checkout.

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * UK phone: +44 or 0 followed by 9–10 digits (mobiles are 0 + 10).
 * Punctuation/spaces are ignored. Deliberately lenient — meant to catch
 * obvious mistakes, not reject valid numbers.
 */
export function isValidUkPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return /^\+44\d{9,10}$/.test(cleaned) || /^0\d{9,10}$/.test(cleaned);
}
