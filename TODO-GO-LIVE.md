# KOK Kitchens — Go-Live Checklist

## Client actions (waiting on KOK)
- [ ] **Stripe account** — client to create account and send API keys (guide sent)
- [ ] **WhatsApp Business** — client to set up on their phone (guide sent)
- [ ] **Custom domain** — point kokkitchens.com (GoDaddy) DNS to Vercel
- [ ] **Real customer testimonials** — replace placeholder quotes
- [ ] **Delivery fees** — confirm local (£4.99) and extended (£7.99) pricing
- [ ] **Allergen information** — provide allergen matrix for menu items

## Backend / Ophir Digital tasks
- [ ] **Stripe integration** — wire up publishable + secret keys once received
- [ ] **Resend email service** — replace placeholder API key (`re_placeholder_add_real_key` in env), verify sending domain once kokkitchens.com is connected
- [ ] **Order notification email** — currently set to `orders@kokkitchens.com` via `NOTIFICATION_EMAIL` env var — confirm or update
- [ ] **Domain setup on Vercel** — add custom domain, configure SSL, set up DNS records
- [ ] **Google Analytics GA4** — create property, add tracking snippet
- [ ] **Privacy Policy & Terms** pages — draft and publish
- [ ] **Uber Direct credentials** — sign up at Uber Direct portal, get `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_CUSTOMER_ID` and add to Vercel env vars
- [ ] **DB migration** — add `delivery_id`, `delivery_status`, `delivery_tracking_url` columns to orders table. Until then the Uber dispatch + webhook UPDATEs throw (errors are swallowed, so orders still succeed but delivery status isn't persisted).
- [ ] **Uber tracking URL** — `app/api/orders/route.ts` returns `trackingUrl` from a non-awaited `.then()`, so it's always `undefined`. Await the dispatch (or persist + fetch) before returning it to the confirmation page.
- [ ] **Server-side fee validation** — checkout sends the Uber fee/total from the client; re-fetch/validate the quote server-side at order time before trusting it (low risk while payment is on delivery).
- [ ] **Database** — confirm Neon DB `DATABASE_URL` is set in Vercel env vars

## Completed
- [x] Vercel Blob store — `BLOB_READ_WRITE_TOKEN` configured
- [x] Instagram link — @kokkkitchen added to footer
- [x] Hero images — client-sharpened, full resolution, unoptimized
- [x] WhatsApp click-to-chat — wired across hero, footer, checkout, floating button (+447447982712)
- [x] Client setup guide — Stripe + WhatsApp (DOCX + PDF in `/docs`)
- [x] Menu photos — all 35 originals restored from backup
- [x] Admin photo upload — working via Vercel Blob
- [x] Uber Direct integration — API client, quote endpoint, dispatch on order, webhook for status updates (needs credentials to go live)
- [x] Delivery comparison doc — Stuart vs Uber vs Gophr (DOCX + PDF in `/docs`)
