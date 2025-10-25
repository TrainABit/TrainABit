import type { PlanQuickStats } from '../types/plan';
import type { Task } from '../types/task';
import type { Milestone } from '../types/milestone';
import type { BudgetItem } from '../types/budget';
import type { KPIMetric } from '../types/kpi';
import { 
  countCompletedTasks, 
  countCompletedMilestones,
  calculateTaskCompletionRate,
  calculateMilestoneCompletionRate,
} from './progressHelpers';
import { calculateKpiStatusCounts } from './kpiHelpers';

/**
 * Calculate quick stats for a plan
 */
export function calculateQuickStats(
  tasks: Task[],
  milestones: Milestone[],
  budgetItems: BudgetItem[],
  kpis: KPIMetric[],
): PlanQuickStats {
  const totalBudgetAllocated = budgetItems.reduce((sum, item) => sum + item.allocation, 0);
  const totalBudgetSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const totalBudgetCommitted = budgetItems.reduce((sum, item) => sum + item.committed, 0);
  const totalBudgetRemaining = budgetItems.reduce((sum, item) => sum + item.remaining, 0);
  const totalBudgetVariance = budgetItems.reduce((sum, item) => sum + item.variance, 0);

  const kpiStatusCounts = calculateKpiStatusCounts(kpis);

  return {
    totalTasks: tasks.length,
    completedTasks: countCompletedTasks(tasks),
    taskCompletionRate: calculateTaskCompletionRate(tasks),
    totalMilestones: milestones.length,
    completedMilestones: countCompletedMilestones(milestones),
    milestoneCompletionRate: calculateMilestoneCompletionRate(milestones),
    totalBudgetAllocated,
    totalBudgetSpent,
    totalBudgetCommitted,
    totalBudgetRemaining,
    totalBudgetVariance,
    kpiStatusCounts,
  };
}
