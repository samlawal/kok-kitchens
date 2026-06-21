# Admin Insights (BI) — Phase 1 spec

_Descriptive business intelligence in the admin panel. Phase-2 demand forecasting is a separate, later piece (notes at the end)._

## Goal
Give the owner a single **Insights** tab answering *"what's selling, when, for how much, and through which channel"* — built from data already in the database. No new customer-facing surface; admin-only.

## Data sources (and one gap to close first)
| Channel | Table | Status |
|---------|-------|--------|
| Food orders | `orders` (`items` JSONB has per-dish lines) | ✅ ready |
| Equipment hire | `hire_bookings` | ✅ ready |
| Catering enquiries | `catering_enquiries` | ✅ now persisted (best-effort) by `/api/catering-enquiry` |

**Both prerequisites are now in place** (commit `08a199c`): the `catering_enquiries` table exists and each lead is persisted, and **`orders.delivery_zone`** is written on both checkout paths (no more inferring zone from the fee). So catering volume and delivery-zone mix are queryable, and **history accrues from launch**. _Run `/api/init` on prod (and staging) once to apply the schema._

## Metrics (Phase 1)
All scoped to a selectable date range `[from, to)`. Decide a **status filter** up front — suggest: count orders that were actually placed (exclude `status = 'cancelled'`); for revenue, card orders should be `payment_status = 'paid'`, COD orders count on placement.

| KPI / chart | Shape | Query sketch |
|-------------|-------|--------------|
| **Revenue, orders, AOV** (headline cards) | 3 numbers | `SELECT COUNT(*), SUM(total), AVG(total) FROM orders WHERE created_at >= $1 AND created_at < $2` |
| **Revenue & volume over time** | line/bar by day | `… SELECT created_at::date AS day, COUNT(*), SUM(total) … GROUP BY day ORDER BY day` |
| **Top dishes** | bar (qty + revenue) | `SELECT item->>'name' AS dish, SUM((item->>'quantity')::int) qty, SUM((item->>'price')::numeric*(item->>'quantity')::int) revenue FROM orders, jsonb_array_elements(items) item WHERE … GROUP BY dish ORDER BY revenue DESC LIMIT 10` |
| **Busiest days of week** | bar | `SELECT EXTRACT(dow FROM created_at AT TIME ZONE 'Europe/London') dow, COUNT(*) … GROUP BY dow` |
| **Busiest hours** | bar | `SELECT EXTRACT(hour FROM created_at AT TIME ZONE 'Europe/London') hr, COUNT(*) … GROUP BY hr` |
| **Channel split** | pie | food (orders) vs hire (`hire_bookings`) vs catering (once persisted) — counts + revenue |
| **Delivery vs pickup** + **zone mix** | pie | `… GROUP BY delivery_type`; zone from `delivery_zone` (or `delivery_fee` band) |
| **Payment method** | pie | `… GROUP BY payment_method` (card vs cod) |
| **Repeat-customer rate** | number | `SELECT COUNT(*) FILTER (WHERE c > 1)::float / COUNT(*) FROM (SELECT customer_phone, COUNT(*) c FROM orders WHERE … GROUP BY customer_phone) t` |

> ⏱ **Timezone:** `created_at` is `TIMESTAMPTZ` — always convert `AT TIME ZONE 'Europe/London'` for day/hour buckets, or "busy times" will be off by the UTC offset (same class of bug as the hire `DATE` handling).

## API
- **`POST /api/admin-insights`** — admin-gated via `verifyAdminSecret` (password in body, like other admin reads), `{ password, from, to }` → returns one aggregated JSON payload (all metrics in a single round-trip). `Cache-Control: no-store`.
- Keep each aggregation a **pure function** taking rows in / shaped data out, so it's unit-testable without a DB (per the repo's testing pattern). Route does auth + SQL + calls the pure shapers.
- **No raw PII in the response** — return aggregates only (names of dishes, counts, totals), never customer contact details.

## Admin UI
- New **"Insights"** tab in the existing admin tab bar (alongside Photos / Pricing / Hire stock / Orders).
- **Date-range picker** (presets: 7d / 30d / 90d / custom) at the top.
- **KPI cards** row (Revenue · Orders · AOV · Repeat %).
- **Charts** — a lightweight lib (e.g. Recharts): revenue-over-time line, top-dishes bar, day-of-week + hour bars, channel/payment/zone pies.
- **Tables** under each chart for the exact numbers (and a CSV export is a cheap, high-value add).
- Empty-state copy for ranges with no data (matters in the first weeks).

## Build notes
- Add `CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at)` (and on `payment_status` if filtering) — aggregations scan by date.
- Reuse `lib/admin-auth.ts` (`verifyAdminSecret`) and the admin tab pattern.
- Build it on a **branch → `staging` → merge** (first real use of the UAT flow).
- **Needs real history** to be useful — schedule the build after ~3–4 weeks of live orders.

## Out of scope (Phase 2 — demand forecasting)
- *"How much to prep/buy next week per dish."* Start **simple** (day-of-week averages + trend), not ML.
- Fold in **known future demand**: `hire_bookings.hire_out_date` and persisted catering `event_date` are confirmed forward bookings — a 150-guest event next Saturday is a hard signal, not a guess.
- Needs ~8–12 weeks of history before a forecast means anything. Revisit once Phase 1 has been collecting data.

## Rough effort
Phase 1: ~1–1.5 days (incl. the `catering_enquiries` persistence add + the `delivery_zone` column). A clean Phase-2 upsell module afterwards.
