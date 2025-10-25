# Model Layer Documentation

## Overview

This document describes the model layer architecture for the 10M Exit Planner application. The model layer consists of TypeScript types, data helpers, Zustand store, and seed data for three strategic plans (A, B, C).

## Architecture

### Directory Structure

```
/types          - TypeScript interfaces and enums
/lib            - Helper functions for calculations
/store          - Zustand store with persistence
/data/seed      - Initial seed data for all plans
```

## Type System

### Core Entities

- **Plan**: Strategic plan with milestones, tasks, budget, KPIs, risks, and resources
- **Task**: Work item with status, assignee, due date, and completion percentage
- **Milestone**: High-level goal with deliverables and timeline
- **BudgetItem**: Financial allocation with spent/committed/remaining tracking
- **KPIMetric**: Key performance indicator with targets and review cadence
- **Risk**: Risk assessment with severity, probability, and mitigation plan
- **Resource**: Advisor, tool, document, partner, or vendor reference

### Enumerations

Located in `types/enums.ts`:

- `TaskStatus`: Task lifecycle states (not_started, in_progress, blocked, completed, cancelled)
- `MilestoneStatus`: Milestone states (upcoming, in_progress, completed, delayed)
- `BudgetCategory`: Budget allocation categories (development, marketing, operations, etc.)
- `KPIStatus`: KPI health states (on_track, at_risk, off_track, achieved)
- `RiskSeverity`: Risk severity levels (low, medium, high, critical)
- `RiskProbability`: Risk likelihood (unlikely, possible, likely, very_likely)
- `ResourceType`: Resource classifications (advisor, tool, document, partner, vendor)
- `ReviewCadence`: Review frequency (daily, weekly, biweekly, monthly, quarterly)

## Helper Functions

### Budget Helpers (`lib/budgetHelpers.ts`)

- `calculateRemaining()`: Calculate remaining budget from allocation, spent, and committed
- `calculateVariance()`: Calculate variance between allocation and spent
- `computeBudgetItem()`: Compute derived fields for a budget item
- `calculateBudgetSummary()`: Aggregate budget totals by category
- `calculateBudgetUtilization()`: Calculate spend as percentage of allocation

### Progress Helpers (`lib/progressHelpers.ts`)

- `calculateProgressFromTasks()`: Average completion percentage across tasks
- `calculateProgressFromMilestones()`: Average completion percentage across milestones
- `calculateMilestoneCompletion()`: Calculate milestone progress from its tasks
- `countCompletedTasks()`: Count tasks with completed status
- `countCompletedMilestones()`: Count milestones at 100% completion
- `calculateTaskCompletionRate()`: Percentage of completed tasks
- `calculateMilestoneCompletionRate()`: Percentage of completed milestones
- `calculatePlanProgress()`: Weighted plan progress (60% tasks, 40% milestones)

### KPI Helpers (`lib/kpiHelpers.ts`)

- `calculateKpiStatusCounts()`: Count KPIs by status

### Quick Stats Helpers (`lib/quickStatsHelpers.ts`)

- `calculateQuickStats()`: Aggregate quick stats for a plan dashboard

## Zustand Store

### Store Location

`store/plansStore.ts`

### State Shape

```typescript
{
  plans: Record<string, Plan>;     // Plans keyed by ID
  planOrder: string[];              // Ordered list of plan IDs
  version: number;                  // Storage schema version
  hydrated: boolean;                // Hydration status flag
}
```

### Store Methods

#### Plan Operations
- `getPlans()`: Get all plans in order
- `getPlanById(planId)`: Get specific plan

#### Task Operations
- `addTask(task)`: Add new task
- `updateTask(taskId, updates)`: Update existing task
- `deleteTask(taskId)`: Remove task
- `getTasksByPlan(planId)`: Get all tasks for a plan
- `getTasksByMilestone(milestoneId)`: Get tasks for a milestone

#### Milestone Operations
- `addMilestone(milestone)`: Add new milestone
- `updateMilestone(milestoneId, updates)`: Update existing milestone
- `deleteMilestone(milestoneId)`: Remove milestone
- `getMilestonesByPlan(planId)`: Get all milestones for a plan

#### Budget Operations
- `addBudgetItem(item)`: Add new budget item
- `updateBudgetItem(itemId, updates)`: Update existing budget item
- `deleteBudgetItem(itemId)`: Remove budget item
- `getBudgetByPlan(planId)`: Get all budget items for a plan
- `getBudgetSummary(planId)`: Get aggregated budget summary

#### KPI Operations
- `addKPI(kpi)`: Add new KPI
- `updateKPI(kpiId, updates)`: Update existing KPI
- `deleteKPI(kpiId)`: Remove KPI
- `getKPIsByPlan(planId)`: Get all KPIs for a plan

#### Risk Operations
- `addRisk(risk)`: Add new risk
- `updateRisk(riskId, updates)`: Update existing risk
- `deleteRisk(riskId)`: Remove risk
- `getRisksByPlan(planId)`: Get all risks for a plan

#### Resource Operations
- `addResource(resource)`: Add new resource
- `updateResource(resourceId, updates)`: Update existing resource
- `deleteResource(resourceId)`: Remove resource
- `getResourcesByPlan(planId)`: Get all resources for a plan

#### Utility Operations
- `refreshQuickStats(planId)`: Recalculate quick stats for a plan
- `setHydrated(value)`: Set hydration status

### Persistence

The store uses Zustand's `persist` middleware with localStorage.

**Storage Key**: `10m-exit-planner-v1`  
**Storage Version**: `1`

#### SSR Safety

The store includes guards for `window` availability to ensure safe server-side rendering:

```typescript
const customStorage: StateStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    // ...
  },
  // ...
};
```

#### Hydration

The store tracks hydration status with the `hydrated` flag. On rehydration, the flag is set to `true`.

#### Automatic Seeding

If no data exists in localStorage, the store automatically seeds with initial plan data on first load (client-side only).

## Seed Data

### Location

Seed data is located in `data/seed/`:

- `planASeed.ts`: Plan A (Quick Exit - 6 months)
- `planBSeed.ts`: Plan B (Sustainable Growth - 18-24 months)
- `planCSeed.ts`: Plan C (Premium Exit - 36+ months)
- `createSeedPlans.ts`: Seed data processor
- `index.ts`: Seed data exports

### Budget Assumptions

#### Plan A: Quick Exit ($150,000)
- **Development**: $80,000 (Core MVP development)
- **Infrastructure**: $15,000 (Essential cloud and tools)
- **Marketing**: $10,000 (Minimal, organic focus)
- **Legal**: $20,000 (Entity formation, IP)
- **Contingency**: $25,000 (Emergency reserve)

#### Plan B: Sustainable Growth ($200,000)
- **Development**: $85,000 (3-4 engineers)
- **Marketing**: $45,000 (Customer acquisition campaigns)
- **Operations**: $25,000 (Support and admin)
- **Infrastructure**: $20,000 (Scaled infrastructure)
- **Legal**: $10,000 (Ongoing legal and compliance)
- **Contingency**: $15,000 (Emergency and opportunity fund)

#### Plan C: Premium Exit ($150,000)
- **Development**: $60,000 (Innovation and R&D)
- **Advisory**: $35,000 (Executive advisors and strategic consulting)
- **Marketing**: $25,000 (Brand and thought leadership)
- **Infrastructure**: $15,000 (Innovation tooling and data platforms)
- **Talent**: $10,000 (Leadership recruiting and development)
- **Contingency**: $5,000 (Innovation opportunities)

**Total Across All Plans**: $500,000

### KPI Assumptions

- **Plan A**: Focus on traction and efficiency; weekly reviews for rapid iteration
- **Plan B**: Growth and revenue metrics; monthly reviews for responsive strategy
- **Plan C**: Long-term enterprise value and strategic relationships; quarterly reviews for deep analysis

### Adjusting Seed Data

To modify seed data:

1. Edit the relevant file in `data/seed/` (planASeed.ts, planBSeed.ts, or planCSeed.ts)
2. Clear localStorage to reset: `localStorage.removeItem('10m-exit-planner-v1')`
3. Reload the application to see changes

For budget adjustments, update:
- `allocation`: Total allocated amount
- `spent`: Amount already spent
- `committed`: Amount committed but not yet spent
- The system will automatically calculate `remaining` and `variance`

## Versioning and Migration

### Current Version

Version 1 (initial schema)

### Future Migrations

When schema changes are needed:

1. Increment `STORAGE_VERSION` in `types/enums.ts`
2. Add migration logic in the persist middleware configuration
3. Handle backwards compatibility for existing stored data

Example migration structure:

```typescript
persist(
  // ... store logic
  {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    migrate: (persistedState: any, version: number) => {
      if (version < 2) {
        // Migration logic for v1 -> v2
      }
      return persistedState;
    },
  }
)
```

## Usage Examples

### Using the Store in Components

```typescript
import { usePlansStore } from './store/plansStore';

function MyComponent() {
  const plans = usePlansStore((state) => state.getPlans());
  const addTask = usePlansStore((state) => state.addTask);
  
  // Use plans and operations
}
```

### Adding a Task

```typescript
const addTask = usePlansStore((state) => state.addTask);

addTask({
  planId: 'plan-a',
  milestoneId: 'plan-a-m1',
  title: 'New task',
  description: 'Task description',
  dueDate: '2024-03-15',
  owner: 'Team Lead',
  assignee: 'Developer',
  status: TaskStatus.NOT_STARTED,
});
```

### Updating a Budget Item

```typescript
const updateBudgetItem = usePlansStore((state) => state.updateBudgetItem);

updateBudgetItem('plan-a-b1', {
  spent: 35000,
  committed: 25000,
});
// remaining and variance are automatically recalculated
```

### Getting Budget Summary

```typescript
const getBudgetSummary = usePlansStore((state) => state.getBudgetSummary);
const summary = getBudgetSummary('plan-a');

console.log(summary.totalSpent);
console.log(summary.categoryTotals[BudgetCategory.DEVELOPMENT]);
```

## Testing

A smoke test script is available to verify store initialization and basic operations:

```bash
npm run test:store
```

(Note: Full test suite will be implemented in a future testing ticket)

## Best Practices

1. **Type Safety**: Always use TypeScript types from `types/` for type checking
2. **Computed Fields**: Never manually set computed fields (remaining, variance, percentComplete, quickStats)
3. **Timestamps**: Let the store manage createdAt/updatedAt timestamps
4. **IDs**: Let the store generate IDs unless importing/syncing data
5. **SSR**: Always check `hydrated` flag before rendering store-dependent content
6. **Performance**: Use selectors to subscribe only to needed state slices

## Future Enhancements

Potential improvements for future iterations:

- [ ] Add undo/redo functionality
- [ ] Implement optimistic updates
- [ ] Add data export/import capabilities
- [ ] Implement collaborative editing with conflict resolution
- [ ] Add real-time sync with backend API
- [ ] Enhance migration system for schema evolution
