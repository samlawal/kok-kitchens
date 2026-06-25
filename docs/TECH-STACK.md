# KOK Kitchens — Tech Stack Reference

_Engineering reference for the KOK Kitchens website infrastructure. Internal — kept with the code so it doesn't drift._

> This is the doc previously embedded in the client handover. It moved out of the handover because the client doesn't need a list of env-var names, and the doc went stale every time we added an integration. Per `_ophir-docs-vault/DOCS-CONVENTIONS.md`: tech-stack reference describes the system → lives with the code.

---

## Stack at a glance

| Layer | Provider | Purpose |
|---|---|---|
| Framework | **Next.js 16** (App Router, React 19, TypeScript) | UI + server routes |
| Hosting | **Vercel** | Auto-deploys on push to `main`; per-branch previews; instant rollback |
| Database | **Neon Postgres** | Orders, hire bookings, catering enquiries, menu overrides, pricing/availability |
| Object storage | **Vercel Blob** | Owner-uploaded dish photos (`meals/{id}.webp`, `hire/{id}.webp` + `_rollback/`) |
| Payments | **Stripe** (Hosted Checkout) | Card payments; webhook → mark `paid` |
| Transactional email | **Resend** | Owner + customer order/enquiry confirmations from `orders@kokkitchens.com` |
| Push alerts | **ntfy.sh** | Phone push for new orders / hire / catering enquiries |
| Courier delivery (optional) | **Uber Direct** | Live courier quotes for the extended-zone fallback (£13.99 until activated) |
| Address autocomplete (optional) | **getAddress.io** | UK street-address lookup at checkout (manual entry works without it) |
| Domain & DNS | **GoDaddy** (`.com`, email host) + **IONOS** (`.co.uk`/`.online`/`.org`/`.store`) | Custom domains; all four IONOS variants redirect to `kokkitchens.com` |
| Email (mailbox) | **Microsoft 365** (via GoDaddy) | `orders@kokkitchens.com` inbox + outbound |

---

## Environment variables

Annotated source of truth: [`.env.example`](../.env.example) — every var is labelled **required vs optional** with its degradation note. Cliff-notes:

**Core (required)**
- `DATABASE_URL` — Neon connection string
- `ADMIN_PASSWORD` — admin auth; fails closed in prod when unset
- `NEXT_PUBLIC_SITE_URL` — canonical origin; `https://kokkitchens.com`

**Email + push (required for confirmations)**
- `RESEND_API_KEY`, `NOTIFICATION_EMAIL`
- `NTFY_TOPIC` (orders), `NTFY_HIRE_TOPIC` (hire)

**Card payments (required for card checkout; pay-on-delivery works without)**
- `STRIPE_SECRET_KEY` (live `sk_live_…`), `STRIPE_WEBHOOK_SECRET` (live `whsec_…`)

**Image uploads (required for admin photo management)**
- `BLOB_READ_WRITE_TOKEN`

**Optional / degrades gracefully**
- `GETADDRESS_API_KEY` — address autofill
- `UBER_CLIENT_ID` / `UBER_CLIENT_SECRET` / `UBER_CUSTOMER_ID` — courier (else flat-rate fallback)
- `GOOGLE_REVIEW_URL` — review redirect destination (else friendly fallback page)

---

## Code repository

- **GitHub:** [github.com/samlawal/kok-kitchens](https://github.com/samlawal/kok-kitchens)
- **Branches:**
  - `main` — production; every push auto-deploys via Vercel
  - `staging` — pre-prod UAT; pinned to `staging.kokkitchens.com` (when set up)
- **Test suite:** Vitest (`npm test`) — 187 unit tests covering admin auth, postcode parsing, hire availability, catering & hire validation, photo rollback, upsell rules, site-URL resolution, etc.
- **Branch protection / change workflow:** see [`LAUNCH-RUNBOOK.md`](LAUNCH-RUNBOOK.md) → "Post-launch — Preview/UAT environment & change workflow".

---

## Operational reference

- [`LAUNCH-RUNBOOK.md`](LAUNCH-RUNBOOK.md) — sequential go-live runbook (domains, DNS, env vars, init).
- [`uber-activation-runbook.md`](uber-activation-runbook.md) — switching Uber Direct on.
- [`KOK Kitchens - Stripe Go-Live.pdf`](.) — live Stripe key + webhook setup.
- [`KOK Kitchens - Hire Inventory Design.md`](KOK%20Kitchens%20-%20Hire%20Inventory%20Design.md) — hire feature design + diagrams.
- [`REGRESSION-PACK.md`](REGRESSION-PACK.md) — what the test suite covers + manual smoke checks.
- [`admin-insights-spec.md`](admin-insights-spec.md) — Phase-2 BI dashboard spec.
- [`../TODO-GO-LIVE.md`](../TODO-GO-LIVE.md) — engineering + KOK-side launch task list.

---

## Who holds what

| Item | Held by | Notes |
|---|---|---|
| Domain registrar accounts (GoDaddy, IONOS) | KOK | KOK pays renewal; Ophir has DNS access where needed |
| Vercel project | Ophir Digital | Deploys + env vars |
| Neon Postgres | Ophir Digital | Connection string in Vercel env only |
| Stripe account | KOK | Customer payments land in KOK's Stripe; Ophir sets the API key in Vercel |
| Resend account + verified `kokkitchens.com` | Ophir Digital | Sender domain verified via DNS records on `kokkitchens.com` |
| Google Business Profile | KOK | Owner-claimed; Ophir feeds the review-form link into `GOOGLE_REVIEW_URL` |
| Source code & deployment access | Ophir Digital | KOK doesn't need or have a GitHub account for this |
