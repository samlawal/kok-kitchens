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

// Pure resolver (ambient state injected) so the fail-closed logic is unit-tested
// without mutating process.env. In PRODUCTION we FAIL CLOSED: if the password is
// unset/blank we return null so callers reject every admin request, rather than
// ever falling back to a publicly-known default. Outside production (dev/test)
// we fall back to a dev-only default so local work and tests don't need the var.
export function resolveAdminPassword(
  pw: string | undefined,
  nodeEnv: string | undefined
): string | null {
  if (typeof pw === "string" && pw.trim().length > 0) return pw;
  if (nodeEnv === "production") return null;
  return "kok-admin-2026";
}

// Resolve the admin password from the environment.
export function getAdminPassword(): string | null {
  return resolveAdminPassword(process.env.ADMIN_PASSWORD, process.env.NODE_ENV);
}

// Verify an incoming secret against the configured admin password. Fails closed
// (false) when no admin password is configured in production. Use this in API
// routes instead of reading process.env.ADMIN_PASSWORD with an inline default.
export function verifyAdminSecret(input: unknown): boolean {
  const expected = getAdminPassword();
  if (expected === null) return false;
  return verifyAdminPassword(input, expected);
}
