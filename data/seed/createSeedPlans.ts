import { seedPlans } from './index';
import { computeBudgetItem } from '../../lib/budgetHelpers';
import { calculatePlanProgress } from '../../lib/progressHelpers';
import { calculateQuickStats } from '../../lib/quickStatsHelpers';
import type { Plan, PlanDraft } from '../../types/plan';
import type { BudgetItem } from '../../types/budget';
import { STORAGE_VERSION } from '../../types/enums';

export interface PlansSeedData {
  plans: Record<string, Plan>;
  planOrder: string[];
  version: number;
}

const seedGeneratedAt = new Date().toISOString();

function ensureBudgetComputed(planId: string, items: PlanDraft['budget']): BudgetItem[] {
  return items.map((item, index) =>
    computeBudgetItem({
      ...item,
      id: item.id ?? `${planId}-budget-${index + 1}`,
      lastUpdated: item.lastUpdated ?? seedGeneratedAt,
      planId,
    }),
  );
}

function finalizePlan(draft: PlanDraft): Plan {
  const createdAt = draft.createdAt ?? seedGeneratedAt;
  const updatedAt = draft.updatedAt ?? seedGeneratedAt;

  const budget = ensureBudgetComputed(draft.id, draft.budget);
  const percentComplete = draft.percentComplete ?? calculatePlanProgress(draft.tasks, draft.milestones);
  const quickStats = draft.quickStats ?? calculateQuickStats(draft.tasks, draft.milestones, budget, draft.kpis);

  return {
    ...draft,
    budget,
    percentComplete,
    quickStats,
    createdAt,
    updatedAt,
  };
}

export function createSeedPlans(): PlansSeedData {
  const plans = seedPlans.reduce<Record<string, Plan>>((acc, draft) => {
    acc[draft.id] = finalizePlan(draft);
    return acc;
  }, {});

  return {
    plans,
    planOrder: seedPlans.map((plan) => plan.id),
    version: STORAGE_VERSION,
  };
}
