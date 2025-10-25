import type { BudgetItem, BudgetItemInput, BudgetSummary } from '../types/budget';
import { BudgetCategory } from '../types/enums';

/**
 * Calculate remaining budget for a budget item
 */
export function calculateRemaining(allocation: number, spent: number, committed: number): number {
  return allocation - spent - committed;
}

/**
 * Calculate variance (difference between allocation and spent)
 */
export function calculateVariance(allocation: number, spent: number): number {
  return allocation - spent;
}

/**
 * Compute fields for a budget item
 */
export function computeBudgetItem(
  item: BudgetItemInput & { id: string; planId: string; lastUpdated: string },
): BudgetItem {
  const remaining = calculateRemaining(item.allocation, item.spent, item.committed);
  const variance = calculateVariance(item.allocation, item.spent);

  return {
    ...item,
    remaining,
    variance,
  } as BudgetItem;
}

/**
 * Calculate budget summary from an array of budget items
 */
export function calculateBudgetSummary(items: BudgetItem[]): BudgetSummary {
  const initialCategoryTotals = Object.values(BudgetCategory).reduce(
    (acc, category) => {
      acc[category] = {
        allocation: 0,
        spent: 0,
        committed: 0,
        remaining: 0,
        variance: 0,
      };
      return acc;
    },
    {} as BudgetSummary['categoryTotals'],
  );

  const summary: BudgetSummary = {
    totalAllocation: 0,
    totalSpent: 0,
    totalCommitted: 0,
    totalRemaining: 0,
    totalVariance: 0,
    categoryTotals: initialCategoryTotals,
  };

  items.forEach((item) => {
    summary.totalAllocation += item.allocation;
    summary.totalSpent += item.spent;
    summary.totalCommitted += item.committed;
    summary.totalRemaining += item.remaining;
    summary.totalVariance += item.variance;

    const categoryTotal = summary.categoryTotals[item.category];
    categoryTotal.allocation += item.allocation;
    categoryTotal.spent += item.spent;
    categoryTotal.committed += item.committed;
    categoryTotal.remaining += item.remaining;
    categoryTotal.variance += item.variance;
  });

  return summary;
}

/**
 * Calculate budget utilization percentage
 */
export function calculateBudgetUtilization(allocation: number, spent: number): number {
  if (allocation === 0) return 0;
  return (spent / allocation) * 100;
}
