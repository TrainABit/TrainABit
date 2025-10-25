# Contributing Guide

Thanks for helping improve the Daily Overview Command Center! This guide explains how to get set up, the quality gates in place, and a manual QA checklist that should be exercised before opening a pull request.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run linting + tests before committing**
   ```bash
   npm run verify
   ```
3. **Optional: wire a pre-commit hook**
   ```bash
   npx husky-init && npm set-script prepare "husky install"
   # then add `npm run verify` to .husky/pre-commit
   ```

## Manual QA Checklist

Run through these flows against both local and deployed environments:

### 1. Tasks Board
- [ ] Toggle each task through the status cycle (`todo → in_progress → blocked → done`).
- [ ] Confirm the completion summary updates and remains screen-reader friendly.
- [ ] Refresh the page/import state and ensure persisted tasks remain accurate.

### 2. Milestone Timeline
- [ ] Verify progress bars, completion percentages, and overdue messaging.
- [ ] Mark a milestone as complete and ensure downstream selectors reflect the change.
- [ ] Check keyboard navigation (Tab/Enter) can reach and activate controls.

### 3. Budget Calculators
- [ ] Adjust DSCR inputs and confirm the ratio/health indicator updates in real time.
- [ ] Modify burn rate and cash-on-hand to observe runway + recommendation changes.
- [ ] Update acquisition budgets/synergy values and validate remaining budget math.

### 4. KPI Insights
- [ ] Spot-check KPI statuses against expectations (on-track, at-risk, off-track).
- [ ] Confirm trend slope messaging aligns with historical data direction.

### 5. Export / Import
- [ ] Export current state using the helper function (or UI once wired).
- [ ] Re-import the payload and verify tasks, milestones, budgets, and KPIs hydrate correctly.
- [ ] Attempt to import malformed JSON to confirm validation errors are raised.

### 6. Accessibility Smoke Test
- [ ] Run `npm run lint` to capture obvious aria/semantic issues (via `jsx-a11y`).
- [ ] Navigate primary flows using keyboard only; ensure focus states are visible.

### 7. Regression Sweep
- [ ] Execute `npm run test` and ensure coverage thresholds remain above the documented targets.
- [ ] Capture notable UI updates with screenshots or short Loom recordings for the release log.

Check off each section (physically or inside the PR description) before requesting review. Releases should only ship once this checklist passes in staging/production.

## Submitting Changes

- Fork or branch from `main`; keep feature branches focused and short-lived.
- Update documentation (README, changelog entries, screenshots) for user-facing changes.
- Add or extend Vitest coverage when fixing bugs or introducing new behaviour.
- Request review from at least one maintainer and provide context for risky changes.

## Code Style

- Follow the existing TypeScript + React patterns and prefer pure domain helpers.
- Keep components accessible (semantic HTML, aria attributes, keyboard-friendly interactions).
- Avoid committing bundler output, coverage artefacts, or editor-specific configuration.

Happy shipping! 🚀
