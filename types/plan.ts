import { KPIStatus, PlanType } from './enums';
import type { BudgetItem, BudgetItemInput } from './budget';
import type { KPIMetric } from './kpi';
import type { Milestone } from './milestone';
import type { Resource } from './resource';
import type { Risk } from './risk';
import type { Task } from './task';

export interface PlanTab {
  id: string;
  planId: string;
  label: string;
  description?: string;
  route?: string;
  order: number;
}

export interface PlanQuickStats {
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  totalMilestones: number;
  completedMilestones: number;
  milestoneCompletionRate: number;
  totalBudgetAllocated: number;
  totalBudgetSpent: number;
  totalBudgetCommitted: number;
  totalBudgetRemaining: number;
  totalBudgetVariance: number;
  kpiStatusCounts: Record<KPIStatus, number>;
}

export interface PlanBase {
  id: string;
  type: PlanType;
  name: string;
  description: string;
  owner: string;
  startDate: string;
  targetDate: string;
  vision: string;
  tabs: PlanTab[];
  milestones: Milestone[];
  tasks: Task[];
  budget: BudgetItem[];
  kpis: KPIMetric[];
  risks: Risk[];
  resources: Resource[];
  quickStats: PlanQuickStats;
  percentComplete: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plan extends PlanBase {}

export type PlanDraft = Omit<Plan, 'budget' | 'quickStats' | 'percentComplete' | 'createdAt' | 'updatedAt'> & {
  budget: BudgetItemInput[];
  quickStats?: PlanQuickStats;
  percentComplete?: number;
  createdAt?: string;
  updatedAt?: string;
};
