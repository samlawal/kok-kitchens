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
