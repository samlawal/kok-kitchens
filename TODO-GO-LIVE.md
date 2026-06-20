# KOK Kitchens — Go-Live Checklist

## Client actions (waiting on KOK)
- [ ] **Stripe account** — client to create account and send API keys (guide sent)
- [ ] **WhatsApp Business** — client to set up on their phone (guide sent)
- [ ] **Uber Direct (optional)** — client to sign up for Uber Direct and send `Client ID`, `Client Secret`, `Customer ID` (guide sent). Site works on flat-rate self-delivery without it.
- [ ] **getAddress.io key** — sign up at getaddress.io (free tier to start), get the API key, add `GETADDRESS_API_KEY` to Vercel + redeploy. Enables street-address autofill at checkout; without it, the postcode + manual address still work.
- [ ] **Custom domain** — point kokkitchens.com (GoDaddy) DNS to Vercel
- [ ] **Real customer testimonials** — replace the invented placeholder quotes in the homepage testimonial marquee (or remove the section until real reviews exist)
- [ ] **Business identity & ICO** — confirm legal status (sole trader vs Ltd), register with the ICO + pay the data-protection fee if required, and supply a trading address (fills the Privacy/Terms placeholders + footer)
- [ ] **Delivery fees** — confirm local (£4.99) and extended (£7.99) pricing
- [ ] **Allergen information** — provide allergen matrix for menu items
- [ ] **Equipment hire stock** — in Admin → **Hire stock**, set how many of each item you own. Items left blank stay "unmanaged" (shown without a stock cap, exactly as before). Live availability + the customer's date picker only apply to items you give a count.
- [ ] **Hire alerts (ntfy)** — subscribe to the **`kok-kitchen-hire`** topic in your ntfy app so equipment‑hire enquiries come through separately from food orders (`kok-kitchen-orders`).

## Backend / Ophir Digital tasks
- [ ] **Strong admin password** 🔒 — set a strong `ADMIN_PASSWORD` in Vercel and redeploy **before launch**. The code now **fails closed in production**: if `ADMIN_PASSWORD` is unset, every admin/mutating route (`/api/upload`, `/api/pricing`, `/api/availability`, `/api/hire-admin`, `/api/orders-status`, `/api/init`) denies all requests — so admin won't work until it's set. The public `kok-admin-2026` default no longer applies in prod.
- [ ] **Run `/api/init` after deploying** — creates/updates all tables incl. hire (`hire_inventory`, `hire_bookings`); idempotent. Now admin-gated, so pass the password: `curl -H "x-admin-password: <ADMIN_PASSWORD>" https://kokkitchens.com/api/init` (or open `/api/init?key=<ADMIN_PASSWORD>` in a browser).
- [ ] **Set `NEXT_PUBLIC_SITE_URL=https://kokkitchens.com` in Vercel** — drives the canonical SEO/OG tags, sitemap, Stripe redirect and Uber tracking webhook. Falls back to the kokkitchens.com default in code if unset, but set it explicitly.
- [ ] **Hire ntfy topic (optional)** — defaults to `kok-kitchen-hire`. Only set `NTFY_HIRE_TOPIC` in Vercel if you want a different topic name.
- [ ] **Stripe go-live** — card payments are built & tested in test mode. To launch: set live `STRIPE_SECRET_KEY` (`sk_live_…`), add a **live-mode** webhook destination → `STRIPE_WEBHOOK_SECRET` (`whsec_…`), redeploy, then one real-card smoke test + refund. Steps in `docs/KOK Kitchens - Stripe Go-Live.pdf`.
- [ ] **Domain setup on Vercel** — add custom domain, configure SSL, set up DNS records
- [ ] **Google Analytics GA4** — create property, add tracking snippet
- [x] **Privacy Policy & Terms** pages — **drafted & published** at `/privacy` and `/terms`, linked from the footer + a consent line at checkout/hire. ⚠️ Owner/legal to **review and complete the bracketed placeholders** (legal entity, ICO registration, trading address, deposit/cancellation/hire-damage terms) **before launch**.
- [ ] **Uber Direct activation** — once the client sends credentials: add `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_CUSTOMER_ID` (+ optional `NEXT_PUBLIC_SITE_URL`) in Vercel, redeploy, then run a sandbox test delivery before enabling. Code is built & gap-fixed; DB columns are in place.
- [ ] **Uber: server-side fee validation** — checkout sends the delivery fee from the client; re-fetch/validate the Uber quote server-side at order/checkout time before trusting it. Do this during activation (needs live quotes to test) — matters now that card payments are live.
## SEO optimisation
**Done so far:** canonical URLs (`NEXT_PUBLIC_SITE_URL` → kokkitchens.com), `sitemap.xml` + `robots.txt`, web manifest + favicon/apple icons, per-page `<title>`/meta descriptions, OpenGraph/Twitter cards + `og-image.png`, FAQ rich-result schema on `/catering`.

**Outstanding** (priority order for a local food/catering business):
- [ ] **Google Business Profile** 🔑 — highest local-SEO impact. KOK to claim/create: business name, address, phone (matching the site exactly = consistent NAP), categories (Caterer / Nigerian restaurant), opening hours, service area (Hertfordshire), photos, and start collecting reviews. _(Owner)_
- [ ] **Google Search Console** — verify kokkitchens.com, submit `sitemap.xml`, monitor indexing + search queries. _(Dev, once the domain is live)_
- [ ] **LocalBusiness / Restaurant structured data** — add JSON-LD with name, address, geo, phone, opening hours, `servesCuisine: Nigerian`, `areaServed: Hertfordshire`, price range, social `sameAs` and menu URL, for the local pack + rich results (currently only FAQ schema exists). _(Dev)_
- [ ] **Keyword-targeted titles/descriptions** — tune each page for local intent ("Nigerian food delivery Hertfordshire", "Nigerian event catering", "jollof rice delivery", "tableware & chafing-dish hire"); add descriptions to menu detail pages. _(Dev)_
- [ ] **Image alt text + filenames** — give menu/dish images descriptive alt text (many are decorative `alt=""`) for image search. _(Dev)_
- [ ] **Core Web Vitals / Lighthouse pass** — the homepage hero serves full-res `unoptimized` images, which likely hurts LCP; review sizing/optimisation, check CLS + performance. _(Dev)_
- [ ] **GA4 + cookie consent** — needed to measure SEO/organic traffic (see analytics item above; build the consent gate in the same change). _(Dev)_
- [ ] **Local citations / directories** — list KOK on Yell + local/Nigerian community directories with consistent NAP to reinforce local ranking. _(Owner, ongoing)_

## Completed
- [x] **Go-live hardening pass** — fixed the hardcoded Vercel preview URL across the SEO/canonical files (now `NEXT_PUBLIC_SITE_URL` → kokkitchens.com); admin auth **fails closed in prod**, `/api/init` gated, and the hire-admin password no longer rides in the URL; added Privacy/Terms pages + footer & consent links; branded 404/error pages; checkout/catering/hire form-label accessibility (`htmlFor`/`id` + `aria-label`); favicon/apple-icon/web-manifest; `.env.example`. `npm run build` + **118 tests** green.
- [x] Equipment hire — live inventory MVP: stock counts + date‑ranged availability (`/api/hire-availability`), enquiries persist as 48h soft‑hold bookings with server‑side oversell protection + 1‑day turnaround buffer, customer date‑picker with live stock badges + capped steppers, admin **Hire stock** tab (set/clear counts, manage booking statuses), and a separate `kok-kitchen-hire` ntfy topic. Design doc + workflow diagrams in `/docs`. Verified end‑to‑end (13 unit tests + live API + UI). **Owner actions in lists above.**
- [x] Accessibility pass — fixed the homepage header contrast/legibility over the hero, added active‑page nav state + focus indicators + skip link, site‑wide `prefers-reduced-motion` support, per‑page `<title>`s, decorative image/icon a11y, and a colour‑contrast sweep (stone‑400→500, orange/green→700). Typecheck + tests green.
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
- [x] Uber Direct integration — API client, quote endpoint, dispatch on order (awaited; tracking-URL bug fixed), status webhook. DB columns (`delivery_id`/`delivery_status`/`delivery_tracking_url`/`updated_at`) applied via `/api/init`. Dormant until credentials; falls back to flat £7.99.
- [x] Delivery comparison doc — Stuart vs Uber vs Gophr (DOCX + PDF in `/docs`)
- [x] Uber Direct client signup guide — DOCX + PDF in `/docs`
