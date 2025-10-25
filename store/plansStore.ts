import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  KPIStatus,
  STORAGE_KEY,
  STORAGE_VERSION,
  TaskStatus,
} from '../types/enums';
import type { BudgetItem, BudgetItemInput, BudgetSummary } from '../types/budget';
import type { KPIMetric, KPIMetricInput } from '../types/kpi';
import type { Milestone, MilestoneInput } from '../types/milestone';
import type { Plan } from '../types/plan';
import type { Resource, ResourceInput } from '../types/resource';
import type { Risk, RiskInput } from '../types/risk';
import type { Task, TaskInput } from '../types/task';
import {
  calculateBudgetSummary,
  computeBudgetItem,
} from '../lib/budgetHelpers';
import {
  calculateMilestoneCompletion,
  calculatePlanProgress,
} from '../lib/progressHelpers';
import { calculateQuickStats } from '../lib/quickStatsHelpers';
import { createSeedPlans } from '../data/seed/createSeedPlans';

export interface PlansStore {
  plans: Record<string, Plan>;
  planOrder: string[];
  version: number;
  hydrated: boolean;

  getPlans: () => Plan[];
  getPlanById: (planId: string) => Plan | undefined;

  getTasksByPlan: (planId: string) => Task[];
  getTasksByMilestone: (milestoneId: string) => Task[];
  addTask: (task: TaskInput) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;

  getMilestonesByPlan: (planId: string) => Milestone[];
  addMilestone: (milestone: MilestoneInput) => void;
  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (milestoneId: string) => void;

  getBudgetByPlan: (planId: string) => BudgetItem[];
  getBudgetSummary: (planId: string) => BudgetSummary;
  addBudgetItem: (item: BudgetItemInput) => void;
  updateBudgetItem: (itemId: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (itemId: string) => void;

  getKPIsByPlan: (planId: string) => KPIMetric[];
  addKPI: (kpi: KPIMetricInput) => void;
  updateKPI: (kpiId: string, updates: Partial<KPIMetric>) => void;
  deleteKPI: (kpiId: string) => void;

  getRisksByPlan: (planId: string) => Risk[];
  addRisk: (risk: RiskInput) => void;
  updateRisk: (riskId: string, updates: Partial<Risk>) => void;
  deleteRisk: (riskId: string) => void;

  getResourcesByPlan: (planId: string) => Resource[];
  addResource: (resource: ResourceInput) => void;
  updateResource: (resourceId: string, updates: Partial<Resource>) => void;
  deleteResource: (resourceId: string) => void;

  refreshQuickStats: (planId: string) => void;
  resetStore: () => void;
  setHydrated: (value: boolean) => void;
}

const memoryStorage: Record<string, string> = {};

export type PersistedPlansState = Pick<PlansStore, 'plans' | 'planOrder' | 'version'>;

const storage = createJSONStorage<PersistedPlansState>(() => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      getItem: (name: string) => memoryStorage[name] ?? null,
      setItem: (name: string, value: string) => {
        memoryStorage[name] = value;
      },
      removeItem: (name: string) => {
        delete memoryStorage[name];
      },
    };
  }

  return window.localStorage;
});

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function getAutoKPIStatus(currentValue: number, targetValue: number): KPIStatus {
  if (targetValue <= 0) {
    return KPIStatus.ON_TRACK;
  }

  const progress = (currentValue / targetValue) * 100;

  if (progress >= 100) return KPIStatus.ACHIEVED;
  if (progress >= 75) return KPIStatus.ON_TRACK;
  if (progress >= 50) return KPIStatus.AT_RISK;
  return KPIStatus.OFF_TRACK;
}

function recalculatePlan(plan: Plan, timestamp: string): Plan {
  const milestones = plan.milestones.map((milestone) => {
    const percentComplete = calculateMilestoneCompletion(milestone.id, plan.tasks);

    if (percentComplete === milestone.percentComplete) {
      return milestone;
    }

    return {
      ...milestone,
      percentComplete,
      updatedAt: timestamp,
    };
  });

  const budget = plan.budget.map((item) =>
    computeBudgetItem({
      ...item,
      planId: plan.id,
      id: item.id,
      lastUpdated: item.lastUpdated ?? timestamp,
    }),
  );

  const quickStats = calculateQuickStats(plan.tasks, milestones, budget, plan.kpis);
  const percentComplete = calculatePlanProgress(plan.tasks, milestones);

  return {
    ...plan,
    milestones,
    budget,
    quickStats,
    percentComplete,
    updatedAt: timestamp,
  };
}

function findPlanIdByTask(plans: Record<string, Plan>, taskId: string): string | null {
  return (
    Object.values(plans).find((plan) => plan.tasks.some((task) => task.id === taskId))?.id ??
    null
  );
}

function findPlanIdByMilestone(plans: Record<string, Plan>, milestoneId: string): string | null {
  return (
    Object.values(plans).find((plan) => plan.milestones.some((m) => m.id === milestoneId))?.id ??
    null
  );
}

function findPlanIdByBudgetItem(plans: Record<string, Plan>, budgetItemId: string): string | null {
  return (
    Object.values(plans).find((plan) => plan.budget.some((item) => item.id === budgetItemId))?.id ??
    null
  );
}

function findPlanIdByKpi(plans: Record<string, Plan>, kpiId: string): string | null {
  return Object.values(plans).find((plan) => plan.kpis.some((kpi) => kpi.id === kpiId))?.id ?? null;
}

function findPlanIdByRisk(plans: Record<string, Plan>, riskId: string): string | null {
  return Object.values(plans).find((plan) => plan.risks.some((risk) => risk.id === riskId))?.id ?? null;
}

function findPlanIdByResource(plans: Record<string, Plan>, resourceId: string): string | null {
  return (
    Object.values(plans).find((plan) => plan.resources.some((resource) => resource.id === resourceId))?.id ??
    null
  );
}

export const usePlansStore = create<PlansStore>()(
  persist(
    (set, get) => {
      const seed = createSeedPlans();

      const applyPlanUpdate = (planId: string, mutator: (plan: Plan) => Plan) => {
        set((state) => {
          const plan = state.plans[planId];
          if (!plan) return state;

          const mutatedPlan = mutator(plan);
          const timestamp = new Date().toISOString();
          const recalculatedPlan = recalculatePlan(mutatedPlan, timestamp);

          return {
            plans: {
              ...state.plans,
              [planId]: recalculatedPlan,
            },
          };
        });
      };

      return {
        plans: seed.plans,
        planOrder: seed.planOrder,
        version: seed.version,
        hydrated: false,

        getPlans: () => get().planOrder.map((id) => get().plans[id]).filter(Boolean) as Plan[],

        getPlanById: (planId: string) => get().plans[planId],

        getTasksByPlan: (planId: string) => get().plans[planId]?.tasks ?? [],

        getTasksByMilestone: (milestoneId: string) => {
          const planId = findPlanIdByMilestone(get().plans, milestoneId);
          if (!planId) return [];
          return get()
            .plans[planId].tasks.filter((task) => task.milestoneId === milestoneId);
        },

        addTask: (taskInput: TaskInput) => {
          const now = new Date().toISOString();
          const task: Task = {
            ...taskInput,
            id: taskInput.id ?? generateId('task'),
            createdAt: taskInput.createdAt ?? now,
            updatedAt: now,
            percentComplete:
              taskInput.percentComplete ??
              (taskInput.status === TaskStatus.COMPLETED ? 100 : 0),
          };

          applyPlanUpdate(task.planId, (plan) => ({
            ...plan,
            tasks: [...plan.tasks, task],
          }));
        },

        updateTask: (taskId: string, updates: Partial<Task>) => {
          const planId = findPlanIdByTask(get().plans, taskId);
          if (!planId) return;

          const now = new Date().toISOString();

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            tasks: plan.tasks.map((task) => {
              if (task.id !== taskId) return task;
              const nextPercent =
                updates.percentComplete ??
                (updates.status === TaskStatus.COMPLETED
                  ? 100
                  : updates.status
                  ? task.percentComplete
                  : task.percentComplete);

              return {
                ...task,
                ...updates,
                percentComplete: Math.min(100, Math.max(0, nextPercent)),
                updatedAt: now,
              };
            }),
          }));
        },

        deleteTask: (taskId: string) => {
          const planId = findPlanIdByTask(get().plans, taskId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            tasks: plan.tasks.filter((task) => task.id !== taskId),
          }));
        },

        getMilestonesByPlan: (planId: string) => get().plans[planId]?.milestones ?? [],

        addMilestone: (milestoneInput: MilestoneInput) => {
          const now = new Date().toISOString();
          const milestone: Milestone = {
            ...milestoneInput,
            id: milestoneInput.id ?? generateId('milestone'),
            createdAt: milestoneInput.createdAt ?? now,
            updatedAt: now,
            percentComplete: milestoneInput.percentComplete ?? 0,
          };

          applyPlanUpdate(milestone.planId, (plan) => ({
            ...plan,
            milestones: [...plan.milestones, milestone],
          }));
        },

        updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => {
          const planId = findPlanIdByMilestone(get().plans, milestoneId);
          if (!planId) return;

          const now = new Date().toISOString();

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            milestones: plan.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    ...updates,
                    updatedAt: now,
                  }
                : milestone,
            ),
          }));
        },

        deleteMilestone: (milestoneId: string) => {
          const planId = findPlanIdByMilestone(get().plans, milestoneId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            milestones: plan.milestones.filter((milestone) => milestone.id !== milestoneId),
            tasks: plan.tasks.map((task) =>
              task.milestoneId === milestoneId ? { ...task, milestoneId: undefined } : task,
            ),
          }));
        },

        getBudgetByPlan: (planId: string) => get().plans[planId]?.budget ?? [],

        getBudgetSummary: (planId: string) => {
          const budget = get().plans[planId]?.budget ?? [];
          return calculateBudgetSummary(budget);
        },

        addBudgetItem: (itemInput: BudgetItemInput) => {
          const now = new Date().toISOString();
          const item = computeBudgetItem({
            ...itemInput,
            id: itemInput.id ?? generateId('budget'),
            planId: itemInput.planId,
            lastUpdated: now,
          });

          applyPlanUpdate(item.planId, (plan) => ({
            ...plan,
            budget: [...plan.budget, item],
          }));
        },

        updateBudgetItem: (itemId: string, updates: Partial<BudgetItem>) => {
          const planId = findPlanIdByBudgetItem(get().plans, itemId);
          if (!planId) return;

          const now = new Date().toISOString();

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            budget: plan.budget.map((item) =>
              item.id === itemId
                ? computeBudgetItem({
                    ...item,
                    ...updates,
                    lastUpdated: now,
                    planId: plan.id,
                    id: item.id,
                  })
                : item,
            ),
          }));
        },

        deleteBudgetItem: (itemId: string) => {
          const planId = findPlanIdByBudgetItem(get().plans, itemId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            budget: plan.budget.filter((item) => item.id !== itemId),
          }));
        },

        getKPIsByPlan: (planId: string) => get().plans[planId]?.kpis ?? [],

        addKPI: (kpiInput: KPIMetricInput) => {
          const now = new Date().toISOString();
          const status =
            kpiInput.status ?? getAutoKPIStatus(kpiInput.currentValue, kpiInput.targetValue);

          const kpi: KPIMetric = {
            ...kpiInput,
            id: kpiInput.id ?? generateId('kpi'),
            status,
            createdAt: kpiInput.createdAt ?? now,
            updatedAt: now,
          };

          applyPlanUpdate(kpi.planId, (plan) => ({
            ...plan,
            kpis: [...plan.kpis, kpi],
          }));
        },

        updateKPI: (kpiId: string, updates: Partial<KPIMetric>) => {
          const planId = findPlanIdByKpi(get().plans, kpiId);
          if (!planId) return;

          const now = new Date().toISOString();

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            kpis: plan.kpis.map((kpi) => {
              if (kpi.id !== kpiId) return kpi;

              const nextCurrent = updates.currentValue ?? kpi.currentValue;
              const nextTarget = updates.targetValue ?? kpi.targetValue;

              return {
                ...kpi,
                ...updates,
                status:
                  updates.status ?? getAutoKPIStatus(nextCurrent, nextTarget),
                updatedAt: now,
              };
            }),
          }));
        },

        deleteKPI: (kpiId: string) => {
          const planId = findPlanIdByKpi(get().plans, kpiId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            kpis: plan.kpis.filter((kpi) => kpi.id !== kpiId),
          }));
        },

        getRisksByPlan: (planId: string) => get().plans[planId]?.risks ?? [],

        addRisk: (riskInput: RiskInput) => {
          const risk: Risk = {
            ...riskInput,
            id: riskInput.id ?? generateId('risk'),
          };

          applyPlanUpdate(risk.planId, (plan) => ({
            ...plan,
            risks: [...plan.risks, risk],
          }));
        },

        updateRisk: (riskId: string, updates: Partial<Risk>) => {
          const planId = findPlanIdByRisk(get().plans, riskId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            risks: plan.risks.map((risk) =>
              risk.id === riskId
                ? {
                    ...risk,
                    ...updates,
                  }
                : risk,
            ),
          }));
        },

        deleteRisk: (riskId: string) => {
          const planId = findPlanIdByRisk(get().plans, riskId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            risks: plan.risks.filter((risk) => risk.id !== riskId),
          }));
        },

        getResourcesByPlan: (planId: string) => get().plans[planId]?.resources ?? [],

        addResource: (resourceInput: ResourceInput) => {
          const now = new Date().toISOString();
          const resource: Resource = {
            ...resourceInput,
            id: resourceInput.id ?? generateId('resource'),
            createdAt: resourceInput.createdAt ?? now,
            updatedAt: now,
          };

          applyPlanUpdate(resource.planId, (plan) => ({
            ...plan,
            resources: [...plan.resources, resource],
          }));
        },

        updateResource: (resourceId: string, updates: Partial<Resource>) => {
          const planId = findPlanIdByResource(get().plans, resourceId);
          if (!planId) return;

          const now = new Date().toISOString();

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            resources: plan.resources.map((resource) =>
              resource.id === resourceId
                ? {
                    ...resource,
                    ...updates,
                    updatedAt: now,
                  }
                : resource,
            ),
          }));
        },

        deleteResource: (resourceId: string) => {
          const planId = findPlanIdByResource(get().plans, resourceId);
          if (!planId) return;

          applyPlanUpdate(planId, (plan) => ({
            ...plan,
            resources: plan.resources.filter((resource) => resource.id !== resourceId),
          }));
        },

        refreshQuickStats: (planId: string) => {
          applyPlanUpdate(planId, (plan) => ({ ...plan }));
        },

        resetStore: () => {
          const freshSeed = createSeedPlans();
          set({
            plans: freshSeed.plans,
            planOrder: freshSeed.planOrder,
            version: freshSeed.version,
          });
        },

        setHydrated: (value: boolean) => {
          set({ hydrated: value });
        },
      };
    },
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        plans: state.plans,
        planOrder: state.planOrder,
        version: state.version,
      }),
    },
  ),
);

export const selectPlanById = (planId: string) => (state: PlansStore) => state.plans[planId];
export const selectPlanProgress = (planId: string) =>
  (state: PlansStore) => state.plans[planId]?.percentComplete ?? 0;
export const selectPlanQuickStats = (planId: string) =>
  (state: PlansStore) => state.plans[planId]?.quickStats;
export const selectBudgetSummary = (planId: string) =>
  (state: PlansStore) => state.getBudgetSummary(planId);
export const selectPlansHydrated = (state: PlansStore) => state.hydrated;
