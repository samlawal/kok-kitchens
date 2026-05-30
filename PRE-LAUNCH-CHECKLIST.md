# Kok Kitchen — Pre-Launch Checklist

Everything needed before the site can go live. Items are grouped by who owns them.

---

## NEEDED FROM CLIENT (Kok Kitchen)

These items **block launch** — we can't proceed without them.

### Payments
- [ ] **Stripe account** — create at [stripe.com](https://stripe.com) and share:
  - `STRIPE_SECRET_KEY` (starts with `sk_live_...`)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_...`)
  - Decide: accept card payments on-site, or WhatsApp/bank transfer only?
- [ ] **Delivery fee confirmation** — currently set to £4.99, is that correct?
- [ ] **Minimum order amount** — is there one? (e.g. £15 minimum)

### Domain & Email
- [ ] **Custom domain** — buy `kokkitchen.co.uk` (or confirm if already owned)
- [ ] **Email address** — is `hello@kokkitchen.co.uk` set up and receiving mail?
- [ ] **Domain DNS** — point to Vercel (we'll provide the CNAME/A records)

### Database
- [ ] **Supabase project** — create free project at [supabase.com](https://supabase.com) and share:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Or: confirm if orders should just go to WhatsApp/email instead of a database

### Images (6 missing)
- [ ] **Drinks photos** — the PDF price list didn't include drinks. Need photos of:
  - Chapman
  - Zobo Drink
  - Fresh Palm Wine
  - Kunu (Millet Drink)
  - Tiger Nut Drink (Kunun Aya)
  - Ginger Drink
- [ ] **Better food photos** — any professional/high-res photos of dishes to replace PDF extractions?
- [ ] **Logo file** — official Kok Kitchen logo (SVG or high-res PNG) if available

### Business Details
- [ ] **Confirm business hours** — currently showing Mon–Fri 10am–9pm, Sat–Sun 11am–10pm
- [ ] **Delivery areas** — list specific areas/postcodes covered
- [ ] **Instagram handle** — footer has a placeholder "IG" link, need the real URL
- [ ] **Food hygiene rating** — 5-star rating from Hertsmere council — add badge?

---

## DEVELOPER TODO (Ophir Digital)

### Payment Integration — CRITICAL
- [ ] Install Stripe: `npm install stripe @stripe/stripe-js @stripe/react-stripe-js`
- [ ] Create checkout session API route (`app/api/checkout/route.ts`)
- [ ] Add Stripe Elements to checkout page for card input
- [ ] Handle payment success/failure webhooks
- [ ] Wire up order confirmation email on successful payment
- [ ] Test with Stripe test keys before going live

### Order Flow — CRITICAL
- [ ] Connect orders API to Supabase (or email/WhatsApp notification)
- [ ] Send order confirmation email to customer
- [ ] Send new order notification to Kok Kitchen (email or WhatsApp Business API)
- [ ] Add order reference number generation
- [ ] Store order history for the business to review

### SEO — HIGH
- [ ] **Open Graph meta tags** — add to `app/layout.tsx`:
  - `og:title`, `og:description`, `og:image`, `og:url`
  - Twitter card tags (`twitter:card`, `twitter:title`, `twitter:image`)
- [ ] **OG image** — create a 1200x630 branded share image
- [ ] **Sitemap** — add `app/sitemap.ts` (auto-generate from menu items)
- [ ] **Robots.txt** — add `app/robots.ts` (allow all, reference sitemap)
- [ ] **Structured data** — add JSON-LD for:
  - `Restaurant` schema (name, address, cuisine, phone)
  - `Menu` schema (menu items with prices)
  - `LocalBusiness` schema (opening hours, delivery area)
- [ ] **Canonical URLs** — set on all pages
- [ ] **Meta descriptions** — unique per page (homepage, menu, catering, about)

### Analytics — HIGH
- [ ] **Google Analytics 4** — get measurement ID from client, add via `next/script`
- [ ] **Google Search Console** — verify domain, submit sitemap
- [ ] **Meta Pixel** (if running Facebook/Instagram ads) — get pixel ID from client

### Performance — MEDIUM
- [ ] Run Lighthouse on live URL — target 90+ all categories
- [ ] Test on real mobile device (not just DevTools)
- [ ] Verify image lazy loading works (check Network tab)
- [ ] Test page load on 3G throttled connection

### Security — MEDIUM
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Add rate limiting to order API
- [ ] Add CSRF protection to forms
- [ ] Set `Content-Security-Policy` headers
- [ ] Add `X-Frame-Options: DENY` header

### Accessibility — MEDIUM
- [ ] Run axe DevTools audit on all pages
- [ ] Test keyboard navigation (Tab through all interactive elements)
- [ ] Verify colour contrast meets WCAG AA (4.5:1)
- [ ] Add `skip-to-content` link
- [ ] Test with screen reader (VoiceOver on Mac)

### Legal — MEDIUM
- [ ] **Privacy Policy page** — required if collecting customer data
- [ ] **Terms & Conditions page** — for orders and delivery
- [ ] **Cookie consent banner** — if using analytics
- [ ] **Allergen information** — required for food businesses in the UK

### Final Polish — LOW
- [ ] Custom 404 page with brand styling
- [ ] Loading states for checkout form submission
- [ ] Email template design (order confirmation, quote request)
- [ ] Form validation error messages (friendly, not raw HTML5)
- [ ] Test checkout flow end-to-end with real data
- [ ] Cross-browser test (Chrome, Safari, Firefox, Edge)

---

## LAUNCH DAY

- [ ] Set environment variables in Vercel dashboard (Stripe, Supabase, analytics)
- [ ] Connect custom domain in Vercel
- [ ] Verify SSL certificate is active
- [ ] Test WhatsApp link opens correct chat (+44 7447 82712)
- [ ] Place a real test order
- [ ] Check all pages load on mobile
- [ ] Submit sitemap to Google Search Console
- [ ] Announce on social media

---

## POST-LAUNCH (Week 1)

- [ ] Monitor Vercel analytics for errors
- [ ] Check Google Search Console for indexing issues
- [ ] Collect first customer feedback
- [ ] Set up Google Business Profile with site link
- [ ] Consider adding customer reviews/testimonials with real names

---

*Last updated: May 2026 — Ophir Digital*
