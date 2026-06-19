# KOK Kitchen — Automated Regression Pack

_Prepared by Ophir Digital. The automated test suite run before every release to catch regressions._

> **Canonical source.** This document lives in the code repo (`docs/REGRESSION-PACK.md`) and versions with the tests it describes. Any PDF/handout is generated from it — see the Ophir docs conventions.

---

## 1. What this is & how to run it

The KOK Kitchen site ships with a suite of **automated unit tests** (Vitest). They cover the
pure business logic behind ordering, the menu, delivery zones, equipment hire and the admin
panel. They run in ~1.5 seconds and require no database, network or secrets.

```bash
# from the kok-kitchens repo
npm test           # runs the whole pack (vitest run)
npx vitest         # watch mode while developing
npx vitest run lib/admin-auth.test.ts   # run one suite
```

**Pass criteria:** every test green. Any red = do not release.

**Current status: 93 / 93 passing** across 12 suites (last verified 19 Jun 2026).

> The pack auto-includes every `lib/*.test.ts` file — adding a new test file automatically
> adds it to the regression run. **Policy: every bug we fix gets a regression test here so it
> can't silently come back.**

---

## 2. Coverage by area

All suites live in `lib/<name>.test.ts`.

| Suite | Tests | What it guards against |
| ------------------------ | ----: | -------------------------------------------------- |
| `admin-auth` | 10 | Admin password check — wrong passwords rejected, whitespace-padded ones tolerated (the "Invalid password" bug) |
| `hire-validation` | 17 | Hire enquiry validation — past dates, zero/invalid items, malformed dates, server-side price trust |
| `hire-availability` | 16 | Date-ranged hire stock maths — overlap, turnaround buffer, soft-hold expiry, oversell clamping |
| `hire-data` | 5 | Hire catalogue integrity (unique ids, valid categories/prices) |
| `menu-overrides` | 8 | Applying admin price/availability/photo overrides to a menu item |
| `menu-overrides-server` | 5 | Server-side aggregation of overrides from the database |
| `use-menu-overrides` | 5 | Client override cache (single fetch, shared, retry on failure) |
| `blob-images` | 7 | Mapping uploaded photos to items (newest wins, `.webp` preferred, cache-bust version) |
| `postcode` | 9 | UK postcode parsing + delivery-zone (local / extended / out-of-area) by distance |
| `validation` | 4 | Email and UK phone validation |
| `order-notifications` | 4 | Order alerts are **awaited** (the dropped serverless-email fix) |
| `address` | 3 | getAddress.io address parsing + "configured?" guard |

---

## 3. Key regression cases (detail)

### 3.1 Admin login — "Invalid password" bug  ·  `admin-auth.test.ts`

> **Origin:** bug reported 19 Jun 2026 — the customer admin tried to update the **Bottled
> Water (drinks)** photo and got "Invalid password" after doing all the work. Root cause: the
> login never checked the password, and every endpoint did an exact compare, so a correct
> password with a stray space (common on iPad keyboards) was rejected. Fixed by
> `verifyAdminPassword()` + validating at login.

| ID | Case | Expected |
|----|------|----------|
| AUTH-01 | Exact password | Accepted |
| AUTH-02 | Trailing space (`"…2026 "`) — the reported bug | **Accepted** |
| AUTH-03 | Leading space / trailing newline | Accepted |
| AUTH-04 | Whitespace on the env/expected side | Accepted |
| AUTH-05 | Wrong password | Rejected |
| AUTH-06 | Case mismatch (`KOK-ADMIN-…`) | Rejected (case-sensitive) |
| AUTH-07 | Inner-whitespace mismatch | Rejected (only edges trimmed) |
| AUTH-08 | Empty / whitespace-only | Rejected |
| AUTH-09 | Non-string input (null/undefined/number) | Rejected |
| AUTH-10 | No password configured | Everything rejected |

### 3.2 Hire enquiry validation  ·  `hire-validation.test.ts`

| ID | Case | Expected |
|----|------|----------|
| HV-01 | Valid enquiry, future date | Accepted; catalogue prices used |
| HV-02 | Today's date | Accepted (today is not "past") |
| HV-03 | No date supplied | Accepted (date optional) |
| HV-04 | Client-supplied price field | Ignored — server price wins |
| HV-05 | Mix of valid + invalid items | Invalid dropped, valid kept |
| HV-06 | **Past date** | **Rejected** ("can't be in the past") |
| HV-07 | Day before today | Rejected |
| HV-08 | **Zero / negative quantities only** | **Rejected** ("No valid hire items") |
| HV-09 | Non-numeric quantity | Rejected |
| HV-10 | Unknown item id | Rejected |
| HV-11 | Missing name / phone | Rejected |
| HV-12 | Malformed date (`31/12/2026`) | Rejected ("valid date") |
| HV-13 | Impossible date (`2026-02-31`) | Rejected |

### 3.3 Hire availability maths  ·  `hire-availability.test.ts`

| ID | Case | Expected |
|----|------|----------|
| HA-01 | Overlapping booking | Stock reduced by booked qty |
| HA-02 | Non-overlapping date | Full stock available |
| HA-03 | Turnaround buffer (day after return) | Still blocked; free the next day |
| HA-04 | Multiple overlapping bookings | Summed; never below zero |
| HA-05 | Expired soft hold | Released (not counted) |
| HA-06 | Cancelled / closed booking | Not counted |
| HA-07 | Zero/negative line inside a booking | Ignored |
| HA-08 | Unmanaged item (no stock row) | No cap returned (`null`) |

---

## 4. Manual smoke checks (not covered by unit tests)

These need a browser/live environment and are run during release verification (the unit pack
covers the logic; these cover the wiring):

| ID | Check | Expected |
|----|-------|----------|
| SM-01 | Admin login with the real password | Lands in the panel; wrong password shows error at login |
| SM-02 | Photos tab — replace a dish/drink photo | Uploads and shows on the live menu |
| SM-03 | Pricing / Availability tabs | Change reflects on the live menu |
| SM-04 | Place a test order (COD + Stripe test card) | Order saved; owner + customer emails sent |
| SM-05 | `/hire` with stock set — pick a date | Live "n available / fully booked" badges; steppers capped |
| SM-06 | Submit a hire enquiry (future date) | Owner email + `kok-kitchen-hire` push; soft hold appears in admin |
| SM-07 | Run `GET /api/init` after deploy | Tables created (idempotent) |

---

## 5. Maintenance

- **New feature →** add unit tests for its pure logic in `lib/<feature>.test.ts`.
- **New bug →** add a failing test that reproduces it, then fix until green (see §1 policy).
- Keep this pack's counts and dates in sync after each release.
