# kok-kitchens — Design Decision Log

> **RULE (uniform across all Ophir projects):** every architectural or product
> decision gets a numbered entry here **in the same commit as the change**.
> Changed your mind? Don't edit history — add a new entry that supersedes the
> old one and link them. Format: context → decision → why → consequences.
> Canonical example with backfilled entries: `ophir-digital/DESIGN.md`.

---

## D-001 — Adopt the design decision log (2026-07-07)
**Context:** Decisions were living in chat sessions and heads, not in the repo.
**Decision:** This file is the running log; existing decisions get backfilled
as the areas they cover are next touched.
**Why:** Decisions belong in git, reviewable next to the code they shaped.

## D-002 — Staging: kok.staging.ophirdigital.com, keyed (2026-07-12)
**Context:** All live Ophir sites get a branded staging URL (platform decision:
`ophir-digital/DESIGN.md` D-023) — a `staging` git branch auto-deploys to a
branch domain for pre-production QA.
**Decision:** `kok.staging.ophirdigital.com` → `staging` branch. Middleware
adds a host-wide key-link gate (`STAGING_KEY`, branch-scoped; one-click
`?key=` link plants a 30-day cookie; fail-open when unset), and next.config
stamps `X-Robots-Tag: noindex` on staging hosts.
**Why:** Staging shows Bola unreleased changes before they hit the live shop;
the key gate matters here because staging hosts are enumerable via
Certificate Transparency logs and this site carries client-confidential
work-in-progress.
**Consequences:** Staging currently has NO database (`DATABASE_URL` is
production-only) — order flows fail there by design until a staging Neon
branch is provisioned. Live `STRIPE_SECRET_KEY` is still targeted at preview
deployments — must be re-scoped to production-only (+ test keys on the
staging branch) before checkout is ever exercised on staging.

## D-003 — Schema drift self-heals: ensureSchema on route DB work (2026-07-18)
**Context:** Bug DRBfP9SOiPY ("add new item" 500s): `custom_menu_items` was
defined in `initDb()` but the table never existed in production — /api/init
is manual and was last run before the feature shipped. First bug through the
staging pipeline (ophir-digital D-031): unit tests were green, the on-staging
check caught the real failure (staging DB = prod copy → same missing table).
**Decision:** `ensureSchema(op)` in lib/db.ts — on Postgres 42P01
(undefined_table) it runs the idempotent `initDb()` and retries the operation
once. All /api/custom-items handlers wrap their DB work in it.
**Why:** Code and schema ship together in this repo only if someone remembers
to call /api/init; self-healing makes the pairing automatic — a missing table
costs one slow request, not a broken feature for weeks.
**Consequences:** First prod add-item after deploy creates the table (no
manual init step). Other routes still fail soft (GET returns []) — wrap them
in ensureSchema as they're next touched. Staging DB was initialized manually
during verification (2026-07-18).

## D-004 — Menu overrides degrade per-slice; missing table no longer blanks the live menu (2026-07-19)
**Context:** Bug bug-2026-07-19-BVY0TOg7M3c ("two prices for goat meat"): Taiwo
repriced Goat Meat Stew £55→£60 in admin and reported "two prices … not working".
Initial hypothesis (a missing `item_name_overrides` table, mirroring D-003) was
DISPROVEN by read-only prod probes: `/api/pricing` showed `goat-meat-stew: 60.00`
and `/api/names` showed the rename — **both admin saves succeeded**. Yet
`/api/menu-overrides` returned prices:0, names:0 and the live `/menu/goat-meat-stew`
showed the £55 default. Root cause: `gatherMenuOverrides` ran its four DB queries
(names/prices/statuses/customItems) under ONE shared `Promise.all`/try-catch. The
`custom_menu_items` table is still absent in prod (the D-003 table, fix undeployed),
so `queryCustomItems` threw 42P01 → the catch blanked **all 14 price overrides and
every name override site-wide**. The "two prices" = £60 in admin vs £55 on the site.
The function's own docstring claimed per-slice isolation it never delivered, and two
tests (`prices fail → statuses also empty`, `names fail → names empty`) had locked
in the collapsing behaviour.
**Decision:** (1) Isolate each DB query in `gatherMenuOverrides` via a `safeQuery`
wrapper — one failing/missing table blanks only its own slice. (2) Wrap the four
menu-overrides route queries in `ensureSchema` (D-003 pattern) so a missing
`custom_menu_items` self-heals on read. (3) Also wrap /api/names handlers in
`ensureSchema` — defensive, per the D-003 "wrap routes as they're next touched"
rollout, not the actual fix here. Corrected the two collapse-encoding tests and
added a regression for the exact shape (missing custom_menu_items must not blank
prices/names). Route test app/api/names/route.test.ts (10 cases) added.
**Why:** The customer-facing menu must degrade per-slice: a table that is missing,
empty, or transiently failing should cost only its own overrides, never silently
revert every price on the site. Isolation is the correctness fix; ensureSchema
removes the drift that triggered it.
**Consequences:** After deploy the live menu immediately honours all existing
price/name overrides again (no data was lost — the tables were fine; only the read
collapsed). First public menu load heals `custom_menu_items` via ensureSchema.
NOTE: deploying this also carries the still-undeployed D-003 custom-items fix
(same branch), so one deploy closes both KOK bugs.

## D-005 — Coerce Neon NUMERIC price at the custom-items boundary (2026-07-21)
**Context:** `bug-2026-07-21-Jc0pDnIObaI` (Taiwo, P2) — clicking the admin Menu
tab crashed to the "Something went wrong" error boundary AND force-logged-out the
admin. Root cause: Neon returns the `price` NUMERIC column as a **string**; the
admin `GET /api/custom-items` returned rows raw (unlike the public menu paths,
which already do `Number(row.price)`), so `formatPrice(price).toFixed()` threw
mid-render. The admin logout is a side effect: admin auth is client-only React
state, so any render crash remounts `/admin` and resets `authenticated` → login
screen. Only surfaced now because the ensureSchema self-heal (68e101f) let items
finally save, so `custom_menu_items` had rows for the first time.
**Decision:** Coerce `price` to a number at the GET boundary
(`rows.map(r => ({ ...r, price: Number(r.price) }))`), matching the established
pattern in `menu-overrides-server.ts` and `menu/[slug]/page.tsx`. Also harden
`formatPrice` with `Number(amount).toFixed(2)` as a render-util backstop.
**Why:** Keep the string→number coercion consistent at every DB boundary; the
shared price formatter must never be able to crash a page on a stray string.
**Consequences:** Not fixed here (separate follow-ups): (1) admin auth is
client-only, so ANY `/admin` render error force-logs-out the admin — an
admin-scoped error boundary that preserves the login would harden it;
(2) pre-existing `lib/menu-overrides.test.ts` fixtures miss the `customItems`
field (type-only, runtime-green).

## D-006 — Consolidate custom-items data access (2026-07-21)
**Context:** `custom_menu_items` had **5 consumers each writing raw SQL** and
hand-coercing Neon's string `price` in **6 scattered places**, behind **2
overlapping row types**. Missing one coercion is precisely what caused D-005
(the admin string-price crash). The area kept producing bugs because the
foundation was duplicated and inconsistent.
**Decision:** One data-access module `lib/custom-items.ts` — a single
`CustomItemRow` (raw, price may be string) + `CustomItem` (domain, price:number)
type, `mapCustomItemRow` (the ONLY coercion point — `Number(price)`),
`customItemToMenuItem` adapter, and `getCustomItems` / `getCustomItemBySlug`
readers (SELECT + `ensureSchema` + map). Every consumer (admin GET route, public
menu page, `menu-overrides-server`) now routes through it; the duplicate
`CustomItem`/`CustomItemRow` types are deleted (re-exported for compatibility).
**Why:** One coercion point instead of six means a new consumer or numeric column
can't silently reintroduce the string-price crash, and the types are now honest
at the DB boundary. Kills the bug class, not just the instance.
**Consequences:** The separate `menu_overrides` price coercion (PriceRow) is left
as-is (already correct); promoting a shared `num()`/db helper across all numeric
columns and all zero-cost-stack client sites is a further generalisation.
Pre-existing test-fixture type errors (`menu-overrides.test.ts`,
`menu-sort.test.ts`) are tracked separately.
