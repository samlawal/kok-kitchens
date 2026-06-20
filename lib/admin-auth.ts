// Shared admin password check.
//
// Trims surrounding whitespace before comparing: mobile keyboards/autofill
// commonly append a trailing space (and env vars sometimes carry a trailing
// newline), which previously turned a correct password into "Invalid password"
// only *after* the admin had done all their work. Comparison stays
// case-sensitive and exact otherwise.
export function verifyAdminPassword(input: unknown, expected: string): boolean {
  if (typeof input !== "string" || typeof expected !== "string") return false;
  const a = input.trim();
  const b = expected.trim();
  if (a.length === 0 || b.length === 0) return false;
  return a === b;
}

// Resolve the admin password from the environment.
//
// In PRODUCTION we FAIL CLOSED: if ADMIN_PASSWORD is unset/blank we return null
// so callers reject every admin request, rather than ever falling back to a
// publicly-known default. Outside production (dev/test) we fall back to a
// dev-only default so local work and the test suite don't need the env var.
export function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (typeof pw === "string" && pw.trim().length > 0) return pw;
  if (process.env.NODE_ENV === "production") return null;
  return "kok-admin-2026";
}

// Verify an incoming secret against the configured admin password. Fails closed
// (false) when no admin password is configured in production. Use this in API
// routes instead of reading process.env.ADMIN_PASSWORD with an inline default.
export function verifyAdminSecret(input: unknown): boolean {
  const expected = getAdminPassword();
  if (expected === null) return false;
  return verifyAdminPassword(input, expected);
}
