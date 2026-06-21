# Uber Direct — Activation Runbook (internal)

Internal steps to switch Uber Direct courier delivery **on** once the client
provides credentials. Until then, extended-zone delivery uses the flat **£13.99**
fallback and **no Uber calls are made**. The *client-facing* signup steps live in
`KOK Kitchens - Uber Direct Setup.pdf` — this is the engineer's counterpart.

## Prerequisites
- Client has completed Uber Direct signup/approval and sent: **Client ID**,
  **Client Secret**, **Customer ID**.
- Pickup address confirmed. It's hardcoded in `lib/uber-delivery.ts` →
  `PICKUP_ADDRESS` (currently `10 Kendals Close, Radlett, WD7 8PQ`). Update there
  and redeploy if different.

## 1. Set env vars (Vercel → Production)
| Variable | Value |
|----------|-------|
| `UBER_CLIENT_ID` | from client |
| `UBER_CLIENT_SECRET` | from client (secret — never commit) |
| `UBER_CUSTOMER_ID` | from client (Direct organisation ID) |
| `NEXT_PUBLIC_SITE_URL` | `https://kokkitchens.com` (or `https://kok-kitchens.vercel.app`) — used to build the per-delivery `webhook_url` so Uber posts status updates back |

`isUberConfigured()` flips to `true` once the three `UBER_*` vars are set → the
dispatch path goes live.

## 2. Redeploy
```
vercel --prod
```
(env changes only take effect on a fresh deploy)

## 3. Smoke test (sandbox)
- **Quote** — `POST /api/delivery/quote` with `{ "address","city","postcode" }`
  using an extended-zone postcode (e.g. `WD18 0AA`). Expect `quote` populated
  (fee + `estimatedMinutes`), **not** `fallbackFee`.
- **Full order** — place an extended-zone delivery order via checkout (or
  `POST /api/orders` with `deliveryType:"delivery"`, `deliveryZone:"extended"`).
  Expect:
  - response includes a real `trackingUrl`
  - the order row gets `delivery_id` + `delivery_status` set (query the DB, or
    extend `/api/orders-status` to return the delivery_* columns)
  - Uber posts to `/api/delivery/webhook` as status changes → `delivery_status`
    advances (`pending` → `pickup` → `dropoff` → `delivered`)
- **Cancel** — `cancelDelivery(deliveryId)` from `lib/uber-delivery.ts` if needed.

## 4. Hardening — do during activation (needs live quotes to test)
- **Server-side fee validation** — `/api/checkout` and `/api/orders` currently use
  the client-sent `deliveryFee`. For the Uber/extended path, re-fetch the quote
  server-side (`getDeliveryQuote`) and use that, or trust only the `quoteId`.
  Matters now that card payments are live (KOK pays Uber the real fee, so a
  tampered fee = KOK eats the difference).
- **Webhook authentication** — `/api/delivery/webhook` currently trusts the POST
  body. Add Uber's webhook signature check (or a shared-secret header) before
  acting on status updates.

## 5. Go-live
With the smoke test passing and hardening done, extended-zone orders auto-quote
and auto-dispatch. Local postcodes stay self-delivery at £8.99.

## Rollback / disable (instant, no code change)
Remove or blank the `UBER_*` env vars in Vercel and redeploy → `isUberConfigured()`
returns `false` → immediate fallback to the flat £13.99. No customer impact.

## Key files
| File | Role |
|------|------|
| `lib/uber-delivery.ts` | API client: OAuth token cache, `getDeliveryQuote`, `createDelivery`, `cancelDelivery`, `getDeliveryStatus`, `isUberConfigured`; `PICKUP_ADDRESS` |
| `app/api/delivery/quote/route.ts` | live quote at checkout (falls back if unconfigured) |
| `app/api/delivery/webhook/route.ts` | Uber status updates → order row |
| `app/api/orders/route.ts` | dispatch on order (extended-zone + configured) |
| `app/checkout/page.tsx` | fetches the quote, passes `deliveryZone` + `deliveryQuoteId` |

## Notes
- Zones are defined in `app/checkout/page.tsx` (`LOCAL_POSTCODES` /
  `EXTENDED_POSTCODES`). Only **extended** orders dispatch via Uber.
- Recommended model (per the Delivery Options Comparison): hybrid — self-deliver
  local postcodes, Uber for extended.
