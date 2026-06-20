# KOK Kitchens — Launch Runbook

_Sequential go-live runbook for Ophir Digital. Do the steps top to bottom._
_Companion to [`../TODO-GO-LIVE.md`](../TODO-GO-LIVE.md) (the full checklist) — this is the ordered "do this, then this" path._

Owner key: **[Ophir]** we do it · **[KOK]** the client does it · **[Ophir↔KOK]** we do it but need something from the client first.

---

## Step 1 — Catering enquiry fix ✅ done
The catering quote form silently failed (POSTed to `/api/orders`, which 400s a catering payload, while the page always showed "Request Received!"). Replaced with a validated `/api/catering-enquiry` endpoint; the page now only shows success on a real `2xx`. Verified + 15 unit tests. **No action — recorded here for completeness.**

## Step 2 — Gather prerequisites **[Ophir↔KOK]**
- [ ] **GoDaddy DNS access** for `kokkitchens.com`
- [ ] KOK's **Stripe account** created + live API keys — _or_ decide to launch **pay-on-delivery only** and add cards later
- [ ] The **strong admin password** KOK chooses (we set it; never commit it)

## Step 3 — Vercel environment variables **[Ophir]**
Vercel → project → **Settings → Environment Variables → Production**:
- [ ] `ADMIN_PASSWORD` = the strong value — _admin routes fail closed until this is set_
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://kokkitchens.com`
- [ ] Confirm present: `DATABASE_URL`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `BLOB_READ_WRITE_TOKEN`, `NTFY_TOPIC`, `NTFY_HIRE_TOPIC`
- [ ] (Catering alerts default to `NTFY_TOPIC`; set `NTFY_CATERING_TOPIC` only to split them out)

See [`../.env.example`](../.env.example) for the full annotated list.

## Step 4 — Deploy & initialise the database **[Ophir]**
- [ ] Redeploy in Vercel (or push to `main` — auto-deploys)
- [ ] Initialise tables (idempotent, admin-gated):
  ```bash
  curl -H "x-admin-password: <ADMIN_PASSWORD>" https://kokkitchens.com/api/init
  ```
- [ ] Confirm the response is `{"success":true}`

## Step 5 — Connect the domains **[Ophir↔KOK]**
**Domain map:** `kokkitchens.com` is the **primary** (canonical URL + email); the other four all **redirect** to it. One live site, four brand-protection redirects — no duplicate content.

| Domain | Role in Vercel |
|--------|----------------|
| `kokkitchens.com` | Primary / production domain |
| `www.kokkitchens.com` | Redirect → `kokkitchens.com` |
| `kokkitchens.co.uk` · `.online` · `.org` · `.store` | Redirect → `kokkitchens.com` |

- [ ] Vercel → **Settings → Domains** → add `kokkitchens.com`, set it **primary**; add `www` as **Redirect → kokkitchens.com**
- [ ] Add `kokkitchens.co.uk`, `.online`, `.org`, `.store` → for each pick **"Redirect to" → kokkitchens.com**
- [ ] At each domain's registrar, add the **A / CNAME** records Vercel shows; SSL auto-issues per domain
- [ ] Verify `https://kokkitchens.com` loads, and each other domain redirects to it
- [ ] **Turn on auto-renew + registrar lock** on all five (they expire **20 Jun 2027** — don't risk losing the brand domains)
- [ ] Email deliverability: confirm **SPF + DKIM** (from Resend) and add a **DMARC** record on `kokkitchens.com` so order/enquiry emails land and the domain can't be spoofed
- [ ] _(Only if you later make `.co.uk` the primary instead: re-verify it in Resend and switch the email `from`-addresses first — otherwise email breaks. Not needed for launch.)_

## Step 6 — Turn on card payments **[Ophir]** _(when KOK's Stripe is ready)_
- [ ] In Stripe **live mode**, copy the `sk_live_…` key
- [ ] Add a **live-mode** webhook endpoint → `https://kokkitchens.com/api/stripe/webhook`, copy the `whsec_…`
- [ ] Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` in Vercel → redeploy
- [ ] **Smoke test:** place one small real card order → confirm it marks _paid_ + both emails arrive → refund it in Stripe
- ⚠️ The **live** `whsec_` is different from the test one — reusing the test secret means payments succeed but orders never mark paid. Full steps: [`KOK Kitchens - Stripe Go-Live.pdf`](.).

## Step 7 — KOK operational setup **[KOK]** _(walk them through)_
- [ ] **WhatsApp Business** set up on their phone
- [ ] **ntfy app**: subscribe to **both** `kok-kitchen-orders` and `kok-kitchen-hire`
- [ ] Admin panel: set **hire stock counts**, replace **placeholder testimonials**, confirm **delivery fees**, load **allergen** info

## Step 8 — Launch-day checks **[Ophir]**
- [ ] End-to-end test on the live domain: a **food order**, a **catering enquiry**, a **hire enquiry** → confirm owner email + phone push arrive each time
- [ ] Eyeball `/privacy`, `/terms`, footer links, and a 404 page
- [ ] 🚀 Announce

## After launch
- [ ] **[KOK]** Send identity fields (trading address, ICO number, legal entity) → **[Ophir]** slot into `/privacy` + `/terms`, redeploy
- [ ] **[KOK]** Google Business Profile · **[Ophir]** Search Console + sitemap, GA4 + consent, LocalBusiness schema, SEO meta (see `TODO-GO-LIVE.md` → SEO)
- [ ] **[KOK]** ICO registration, insurance, food-business registration (see `HANDOVER.md` → "Before You Trade")
- [ ] **[Ophir]** Uber Direct activation + server-side delivery-fee validation (when couriers go live)

---

_Rollback for any integration: blank its env vars in Vercel and redeploy — the site falls back (cards → pay-on-delivery, courier → flat £7.99, address autofill → manual entry). No code change needed._
