import { BudgetCategory } from './enums';

export interface BudgetItem {
  id: string;
  planId: string;
  category: BudgetCategory;
  description: string;
  allocation: number;
  spent: number;
  committed: number;
  remaining: number;
  variance: number;
  owner: string;
  lastUpdated: string;
  notes?: string;
}

export type BudgetItemInput = Omit<BudgetItem, 'id' | 'remaining' | 'variance' | 'lastUpdated'> & {
  id?: string;
  remaining?: number;
  variance?: number;
  lastUpdated?: string;
};

export interface BudgetSummary {
  totalAllocation: number;
  totalSpent: number;
  totalCommitted: number;
  totalRemaining: number;
  totalVariance: number;
  categoryTotals: Record<BudgetCategory, {
    allocation: number;
    spent: number;
    committed: number;
    remaining: number;
    variance: number;
  }>;
}
