# Docs

Engineering & QA documentation for KOK Kitchens. These live **with the code** so they
version and get reviewed in the same PRs (docs-as-code) — they describe the system, so if
the system changes, they change in the same commit.

| File | What it is |
|------|------------|
| `LAUNCH-RUNBOOK.md` | Sequential go-live runbook (ordered steps; companion to `../TODO-GO-LIVE.md`) |
| `TECH-STACK.md` | Engineering reference — stack, env vars, repo, ownership map (moved out of the client handover) |
| `admin-insights-spec.md` | Phase-1 admin BI/Insights spec (metrics, queries, layout) — build after a few weeks of data |
| `REGRESSION-PACK.md` | The automated test suite catalogue + manual smoke checks (run before every release) |
| `KOK Kitchens - Hire Inventory Design.md` | Design of the equipment-hire inventory/booking system (+ diagrams in `diagrams/`) |
| `KOK Kitchens - Setup Guide` / `Stripe Go-Live` / `Uber Direct Setup` | Operational runbooks |
| `KOK Kitchens - Delivery Options Comparison` | Decision record for the delivery provider |

**Client-facing & business documents** (handover, pre-launch checklist, proposals,
questionnaires, QA reports, client bug reports) do **not** live here — they live in the Ophir
docs vault under `Clients/kok-kitchen/`. Any PDF in the vault is *generated* from a source in
this folder, never hand-edited in two places.

See the org-wide standard: `_ophir-docs-vault/DOCS-CONVENTIONS.md`.
