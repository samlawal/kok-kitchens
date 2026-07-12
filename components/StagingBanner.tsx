/**
 * A clear banner shown ONLY on staging/preview deployments, so a tester never
 * mistakes them for the live site (pattern shared across Ophir client sites;
 * see purpose-in-pain). Shows when either:
 *  - VERCEL_ENV is "preview" (branch/preview deploys, incl. the staging
 *    branch domain), or
 *  - NEXT_PUBLIC_APP_ENV is "staging" (set branch-scoped by the staging
 *    provisioning script).
 * On the live site and local dev, neither is true, so nothing renders.
 */
export function StagingBanner() {
  const isStaging =
    process.env.NEXT_PUBLIC_APP_ENV === "staging" || process.env.VERCEL_ENV === "preview";
  if (!isStaging) return null;
  return (
    <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-amber-950">
      Staging — for testing only. This is not the live site.
    </div>
  );
}
