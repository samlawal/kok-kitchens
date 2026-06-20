// Single source of truth for the site's canonical origin.
//
// Override per environment with NEXT_PUBLIC_SITE_URL (set this in Vercel to the
// production domain). Falls back to the live domain so the SEO/canonical tags,
// sitemap and Stripe redirect are never left pointing at a Vercel preview URL.
// Pure resolver (env value injected) so it's unit-testable: trims, falls back to
// the live domain on a blank/whitespace value, and strips trailing slashes so
// the origin never ends in "/" (which would double-slash every built URL).
export function resolveSiteUrl(raw?: string | null): string {
  const v = typeof raw === "string" && raw.trim() ? raw.trim() : "https://kokkitchens.com";
  return v.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
