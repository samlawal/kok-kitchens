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
