import type { Milestone, Task } from '../types';

export interface TaskProgressSummary {
  completionRate: number;
  completed: number;
  total: number;
  remaining: number;
  weighted: boolean;
}

export interface MilestoneProgressSummary extends TaskProgressSummary {
  milestoneId: string;
  label: string;
  dueDate: string;
  overdue: boolean;
  daysRemaining: number;
}

const toTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const calculateTaskProgress = (tasks: Task[]): TaskProgressSummary => {
  if (!tasks.length) {
    return {
      completionRate: 0,
      completed: 0,
      total: 0,
      remaining: 0,
      weighted: false
    };
  }

  const weights = tasks.map((task) => task.weight ?? 1);
  const weighted = weights.some((weight) => weight !== 1);
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  const completedWeight = tasks.reduce((acc, task, index) => {
    if (task.status === 'done') {
      return acc + weights[index];
    }

    return acc;
  }, 0);

  const completionRate = totalWeight === 0 ? 0 : toTwoDecimals(completedWeight / totalWeight);
  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const totalCount = tasks.length;

  return {
    completionRate,
    completed: completedCount,
    total: totalCount,
    remaining: totalCount - completedCount,
    weighted
  };
};

const MS_IN_DAY = 86_400_000;

export const calculateMilestoneProgress = (
  milestone: Milestone,
  referenceDate = new Date()
): MilestoneProgressSummary => {
  const taskSummary = calculateTaskProgress(milestone.tasks);
  const dueDate = new Date(milestone.targetDate);
  const differenceMs = dueDate.getTime() - referenceDate.getTime();
  const daysRemaining = Math.ceil(differenceMs / MS_IN_DAY);
  const overdue = taskSummary.completionRate < 1 && daysRemaining < 0;

  return {
    ...taskSummary,
    milestoneId: milestone.id,
    label: milestone.title,
    dueDate: milestone.targetDate,
    overdue,
    daysRemaining
  };
};

export interface PortfolioProgressSummary {
  milestones: MilestoneProgressSummary[];
  averageCompletion: number;
  completedMilestones: number;
  overdueMilestones: number;
  tasksRemaining: number;
}

export const summarizePortfolioProgress = (
  milestones: Milestone[],
  referenceDate = new Date()
): PortfolioProgressSummary => {
  if (!milestones.length) {
    return {
      milestones: [],
      averageCompletion: 0,
      completedMilestones: 0,
      overdueMilestones: 0,
      tasksRemaining: 0
    };
  }

  const milestoneSummaries = milestones.map((milestone) => calculateMilestoneProgress(milestone, referenceDate));
  const totalCompletion = milestoneSummaries.reduce((acc, milestone) => acc + milestone.completionRate, 0);
  const averageCompletion = toTwoDecimals(totalCompletion / milestoneSummaries.length);
  const completedMilestones = milestoneSummaries.filter((milestone) => milestone.completionRate === 1).length;
  const overdueMilestones = milestoneSummaries.filter((milestone) => milestone.overdue).length;
  const tasksRemaining = milestoneSummaries.reduce((acc, summary) => acc + summary.remaining, 0);

  return {
    milestones: milestoneSummaries,
    averageCompletion,
    completedMilestones,
    overdueMilestones,
    tasksRemaining
  };
};
