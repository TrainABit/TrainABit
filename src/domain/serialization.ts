import type { AppState, BudgetState, KPI, Milestone, Task } from '../types';

const CURRENT_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const isTask = (value: unknown): value is Task => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.title) &&
    ['todo', 'in_progress', 'blocked', 'done'].includes(String(value.status))
  );
};

const isMilestone = (value: unknown): value is Milestone => {
  if (!isRecord(value)) {
    return false;
  }

  const tasks = value.tasks;
  const hasValidTasks = Array.isArray(tasks) && tasks.every((task) => isTask(task));

  return (
    isString(value.id) &&
    isString(value.title) &&
    isString(value.targetDate) &&
    ['planned', 'in_progress', 'completed'].includes(String(value.status)) &&
    hasValidTasks
  );
};

const isKpi = (value: unknown): value is KPI => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.label) &&
    isNumber(value.target as number) &&
    isNumber(value.actual as number) &&
    ['increase', 'decrease'].includes(String(value.direction))
  );
};

const isBudgetState = (value: unknown): value is BudgetState => {
  if (!isRecord(value)) {
    return false;
  }

  const { planA, planB, planC } = value;

  const planAValid =
    isRecord(planA) &&
    isNumber(planA.netOperatingIncome) &&
    isNumber(planA.totalDebtService);

  const planBValid =
    isRecord(planB) &&
    isNumber(planB.cashOnHand) &&
    isNumber(planB.monthlyBurn);

  const planCValid =
    isRecord(planC) &&
    Array.isArray(planC.acquisitions) &&
    planC.acquisitions.every((acquisition) => {
      return (
        isRecord(acquisition) &&
        isString(acquisition.id) &&
        isString(acquisition.name) &&
        isNumber(acquisition.price)
      );
    }) &&
    isNumber(planC.budget);

  return planAValid && planBValid && planCValid;
};

export const serializeAppState = (state: AppState): string => {
  return JSON.stringify({ version: CURRENT_VERSION, payload: state });
};

export const deserializeAppState = (raw: string): AppState => {
  const parsed = JSON.parse(raw) as {
    version?: number;
    payload?: unknown;
  };

  if (!isRecord(parsed) || parsed.version !== CURRENT_VERSION || !parsed.payload) {
    throw new Error('Serialized state is incompatible with the current version');
  }

  const payload = parsed.payload;

  if (!isRecord(payload)) {
    throw new Error('Serialized state payload is malformed');
  }

  const { tasks, milestones, budget, kpis, lastUpdated, version } = payload;

  if (!Array.isArray(tasks) || !tasks.every((task) => isTask(task))) {
    throw new Error('Serialized tasks are invalid');
  }

  if (!Array.isArray(milestones) || !milestones.every((milestone) => isMilestone(milestone))) {
    throw new Error('Serialized milestones are invalid');
  }

  if (!isBudgetState(budget)) {
    throw new Error('Serialized budget is invalid');
  }

  if (!Array.isArray(kpis) || !kpis.every((kpi) => isKpi(kpi))) {
    throw new Error('Serialized KPIs are invalid');
  }

  if (!isString(lastUpdated)) {
    throw new Error('Serialized timestamp is invalid');
  }

  const budgetState: BudgetState = {
    planA: { ...budget.planA },
    planB: { ...budget.planB },
    planC: {
      ...budget.planC,
      acquisitions: budget.planC.acquisitions.map((acquisition) => ({ ...acquisition }))
    }
  };

  const appState: AppState = {
    tasks: tasks.map((task) => ({ ...task })) as Task[],
    milestones: milestones.map((milestone) => ({
      ...milestone,
      tasks: milestone.tasks.map((task) => ({ ...task }))
    })),
    budget: budgetState,
    kpis: kpis.map((kpi) => ({ ...kpi })) as KPI[],
    lastUpdated,
    version: Number(version ?? CURRENT_VERSION)
  };

  return appState;
};
