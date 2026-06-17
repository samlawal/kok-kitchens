# KOK Kitchens — Go-Live Checklist

## Client actions (waiting on KOK)
- [ ] **Stripe account** — client to create account and send API keys (guide sent)
- [ ] **WhatsApp Business** — client to set up on their phone (guide sent)
- [ ] **Custom domain** — point kokkitchens.com (GoDaddy) DNS to Vercel
- [ ] **Real customer testimonials** — replace placeholder quotes
- [ ] **Delivery fees** — confirm local (£4.99) and extended (£7.99) pricing
- [ ] **Allergen information** — provide allergen matrix for menu items

## Backend / Ophir Digital tasks
- [ ] **Strong admin password** 🔒 — `ADMIN_PASSWORD` is currently the default `kok-admin-2026`, which guards `/api/upload`, `/api/pricing`, `/api/availability` and `/api/orders-status` (view + delete orders). Set a strong value in Vercel and redeploy **before launch**.
- [ ] **Stripe go-live** — card payments are built & tested in test mode. To launch: set live `STRIPE_SECRET_KEY` (`sk_live_…`), add a **live-mode** webhook destination → `STRIPE_WEBHOOK_SECRET` (`whsec_…`), redeploy, then one real-card smoke test + refund. Steps in `docs/KOK Kitchens - Stripe Go-Live.pdf`.
- [ ] **Domain setup on Vercel** — add custom domain, configure SSL, set up DNS records
- [ ] **Google Analytics GA4** — create property, add tracking snippet
- [ ] **Privacy Policy & Terms** pages — draft and publish
- [ ] **Uber Direct credentials** — sign up at Uber Direct portal, get `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_CUSTOMER_ID` and add to Vercel env vars
- [ ] **DB migration** — add `delivery_id`, `delivery_status`, `delivery_tracking_url` columns to orders table. Until then the Uber dispatch + webhook UPDATEs throw (errors are swallowed, so orders still succeed but delivery status isn't persisted).
- [ ] **Uber tracking URL** — `app/api/orders/route.ts` returns `trackingUrl` from a non-awaited `.then()`, so it's always `undefined`. Await the dispatch (or persist + fetch) before returning it to the confirmation page.
- [ ] **Server-side fee validation** — checkout sends the Uber fee/total from the client; re-fetch/validate the quote server-side at order time before trusting it (low risk while payment is on delivery).
## Completed
- [x] Stripe card payments — hosted Checkout built (card option alongside pay-on-delivery), verified **end-to-end in test mode** (payment → webhook → order marked paid → emails). Go-live steps in `/docs`.
- [x] Resend email — real `RESEND_API_KEY` set, `kokkitchens.com` verified in Resend, live send confirmed; owner + customer order emails send from `orders@kokkitchens.com` (to `NOTIFICATION_EMAIL`)
- [x] Database — Neon `DATABASE_URL` set; tables created via `GET /api/init` (orders, price_overrides, item_availability)
- [x] Pricing + availability + photos reflect on the live menu — unified `/api/menu-overrides` + `resolveItem`, consumed by every meal card and the detail page (verified end-to-end in prod)
- [x] Vercel Blob store — `BLOB_READ_WRITE_TOKEN` configured
- [x] Instagram link — @kokkkitchen added to footer
- [x] Hero images — client-sharpened, full resolution, unoptimized
- [x] WhatsApp click-to-chat — wired across hero, footer, checkout, floating button (+447447982712)
- [x] Client setup guide — Stripe + WhatsApp (DOCX + PDF in `/docs`)
- [x] Menu photos — all 35 originals restored from backup
- [x] Admin photo upload — working via Vercel Blob
- [x] Uber Direct integration — API client, quote endpoint, dispatch on order, webhook for status updates (needs credentials to go live)
- [x] Delivery comparison doc — Stuart vs Uber vs Gophr (DOCX + PDF in `/docs`)
