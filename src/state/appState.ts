import { calculatePlanADscr, calculatePlanBRunway, calculatePlanCAcquisitionRollup } from '../domain/budget';
import { deriveKpiStatus } from '../domain/kpi';
import { calculateTaskProgress, summarizePortfolioProgress } from '../domain/progress';
import type { AppState, TaskStatus } from '../types';

export const initialAppState: AppState = {
  tasks: [
    { id: 'task-1', title: 'Design task board experience', status: 'done', weight: 2 },
    { id: 'task-2', title: 'Integrate weather provider', status: 'in_progress', weight: 1 },
    { id: 'task-3', title: 'QA import/export flows', status: 'todo', weight: 1 },
    { id: 'task-4', title: 'Milestone Slack notifications', status: 'blocked', weight: 1 }
  ],
  milestones: [
    {
      id: 'ms-1',
      title: 'Public beta launch',
      targetDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      status: 'in_progress',
      tasks: [
        { id: 'task-1', title: 'Design task board experience', status: 'done', weight: 2 },
        { id: 'task-2', title: 'Integrate weather provider', status: 'in_progress', weight: 1 }
      ]
    },
    {
      id: 'ms-2',
      title: 'Revenue milestone',
      targetDate: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      status: 'planned',
      tasks: [
        { id: 'task-3', title: 'QA import/export flows', status: 'todo', weight: 1 },
        { id: 'task-4', title: 'Milestone Slack notifications', status: 'blocked', weight: 1 }
      ]
    }
  ],
  budget: {
    planA: {
      netOperatingIncome: 125000,
      totalDebtService: 90000,
      minimumRatio: 1.25
    },
    planB: {
      cashOnHand: 300000,
      monthlyBurn: 40000,
      growthRate: 0.1,
      additionalFunding: 50000
    },
    planC: {
      budget: 750000,
      synergySavings: 60000,
      contingencyRate: 0.1,
      acquisitions: [
        { id: 'acq-1', name: 'Productivity Pro', price: 200000, integrationCost: 40000, expectedSynergy: 30000 },
        { id: 'acq-2', name: 'WeatherPlus', price: 120000, integrationCost: 15000, expectedSynergy: 20000 }
      ]
    }
  },
  kpis: [
    {
      id: 'kpi-1',
      label: 'Daily active users',
      target: 5000,
      actual: 5200,
      direction: 'increase',
      tolerance: 0.05,
      trend: [3500, 4200, 4800, 5200]
    },
    {
      id: 'kpi-2',
      label: 'Churn rate',
      target: 4,
      actual: 5,
      direction: 'decrease',
      tolerance: 1,
      trend: [6, 5.5, 5.2, 5]
    }
  ],
  lastUpdated: new Date().toISOString(),
  version: 1
};

export const appSelectors = {
  taskProgress: (state: AppState) => calculateTaskProgress(state.tasks),
  milestonePortfolio: (state: AppState) => summarizePortfolioProgress(state.milestones),
  planADscr: (state: AppState) => calculatePlanADscr(state.budget.planA),
  planBRunway: (state: AppState) => calculatePlanBRunway(state.budget.planB),
  planCAcquisitionSummary: (state: AppState) => calculatePlanCAcquisitionRollup(state.budget.planC),
  kpiStatuses: (state: AppState) => state.kpis.map((kpi) => deriveKpiStatus(kpi))
};

export const updateTaskStatus = (
  state: AppState,
  taskId: string,
  status: TaskStatus
): AppState => {
  const updatedTasks = state.tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          status
        }
      : task
  );

  return {
    ...state,
    tasks: updatedTasks,
    lastUpdated: new Date().toISOString()
  };
};
