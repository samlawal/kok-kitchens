// Single source of truth for the site's canonical origin.
//
// Override per environment with NEXT_PUBLIC_SITE_URL (set this in Vercel to the
// production domain). Falls back to the live domain so the SEO/canonical tags,
// sitemap and Stripe redirect are never left pointing at a Vercel preview URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kokkitchens.com"
).replace(/\/+$/, "");
