# Daily Overview Command Center

A React + TypeScript workspace for orchestrating the personal productivity "Daily Overview" experience. The application curates a unified command center that blends task planning, milestone visualisation, financial strategy, KPI health, and import/export tooling for product teams that iterate quickly.

## Product Overview

- **Tasks board** – triage and prioritise daily work with a weighted completion model that keeps cross-functional pods aligned.
- **Milestone timeline** – track release trains with timeline health indicators, overdue warnings, and progress accessibility cues.
- **Budget playbooks** – model three budgeting scenarios (Plan A: DSCR, Plan B: Runway, Plan C: Acquisition Roll-up) to steer strategic decisions.
- **KPI cockpit** – derive health, variance, and trend slopes for core metrics to highlight leading indicators.
- **Data portability** – export/import helpers safely serialise application state for backups, analytics, and bulk edits.

_Primary features are described in detail throughout this document; see the Deployment section for a public preview linked via Vercel._

## Architecture

| Layer | Purpose | Key Modules |
| --- | --- | --- |
| **Domain** | Pure calculation helpers for progress, budgeting, KPI derivations, and state serialisation. | `src/domain/*.ts` |
| **State** | Declarative selectors and immutable update helpers that expose typed projections for the UI. | `src/state/appState.ts` |
| **Interface** | Accessible React components for the tasks board, milestone timeline, and budgeting inputs. | `src/components/*.tsx` |
| **Tooling** | Vitest for unit/integration tests, ESLint for linting, jsdom + RTL for component tests. | `vitest.config.ts`, `.eslintrc.cjs` |

### Data Model Highlights

| Entity | Fields |
| --- | --- |
| `Task` | `id`, `title`, `status`, `weight`, `dueDate`, `owner` |
| `Milestone` | `id`, `title`, `targetDate`, `status`, `tasks[]` |
| `Budget.planA` | `netOperatingIncome`, `totalDebtService`, `minimumRatio` |
| `Budget.planB` | `cashOnHand`, `monthlyBurn`, `growthRate`, `additionalFunding` |
| `Budget.planC` | `budget`, `acquisitions[]`, `synergySavings`, `contingencyRate` |
| `KPI` | `id`, `label`, `target`, `actual`, `direction`, `tolerance`, `trend` |
| `AppState` | Aggregate of the above plus timestamps + semantic versioning |

### State Management Approach

- Domain logic is completely framework-agnostic, making it trivial to reuse inside future services or analytics pipelines.
- `appSelectors` combine domain helpers into derived data (progress summaries, DSCR status, runway projections, roll-up analysis, KPI health).
- `updateTaskStatus` demonstrates immutable updates; future reducers or Zustand stores can reuse the same helpers.
- Serialisation helpers (`serializeAppState` / `deserializeAppState`) enforce schema shape and version compatibility so exports remain forward-compatible.

## Automated Testing & Quality Gates

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies (run once per environment). |
| `npm run test` | Execute Vitest in headless mode with coverage (80% statements/lines/functions, 75% branches). |
| `npm run test:watch` | Interactive watch mode for rapid feedback. |
| `npm run lint` | Lint TypeScript/React sources via ESLint. |
| `npm run verify` | Convenience script that runs linting followed by the full test suite. |

> **Pre-commit recommendation**: Wire `npm run verify` into your local Git hooks (e.g. via Husky or a pre-commit tool of choice). This repository documents the workflow; CI will reject changes that fail linting or tests.

Vitest setup includes jsdom, React Testing Library, user-event, and global mocks for `localStorage` and `matchMedia`. Tests cover domain logic, selectors, and key interactive components so regressions are caught early.

## Deployment (Vercel)

A production preview is served from Vercel (replace with your live URL if different): **https://daily-overview-app.vercel.app**

To deploy updates:

1. Ensure `main` is green (`npm run verify`).
2. Configure environment variables in Vercel (none required for the current feature set).
3. Connect the repository to Vercel and trigger a new deployment (push to `main` or use the Vercel dashboard).
4. Smoke test the live preview using the manual QA checklist (see `CONTRIBUTING.md`).

## Export / Import Guidance

- Use `serializeAppState(appState)` to capture a versioned JSON payload (safe for backups or analytics).
- Restore with `deserializeAppState(serialized)`; strict guards validate tasks, milestones, budgets, and KPIs before hydrating the UI.
- Invalid or mismatched versions throw actionable errors, keeping migrations explicit.

## Roadmap

- Calendar + weather integrations with live API data.
- Personal assistant skills (notification nudges, focus mode suggestions).
- Collaborative workspace (multi-user assignments, presence indicators).
- Expanded budgeting (sensitivity analysis, scenario comparisons).
- Snapshot history for KPIs and budgets with CSV export.

## Manual QA & Contribution Workflow

- Follow the **Manual QA checklist** and workflow guidelines in [`CONTRIBUTING.md`](./CONTRIBUTING.md) before raising a pull request.
- Open issues with the template in GitHub to capture acceptance criteria, context, and risk level.
- Document user-facing changes with updated screenshots or short Looms where applicable.

---

Need help or have ideas? Reach out via Issues or Discussions—contributions are welcome!
