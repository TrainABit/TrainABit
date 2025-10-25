export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  weight?: number;
  dueDate?: string;
  owner?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  tasks: Task[];
}

export interface BudgetPlanAInput {
  netOperatingIncome: number;
  totalDebtService: number;
  minimumRatio?: number;
}

export interface BudgetPlanBInput {
  cashOnHand: number;
  monthlyBurn: number;
  growthRate?: number;
  additionalFunding?: number;
}

export interface Acquisition {
  id: string;
  name: string;
  price: number;
  integrationCost?: number;
  expectedSynergy?: number;
}

export interface BudgetPlanCInput {
  budget: number;
  acquisitions: Acquisition[];
  synergySavings?: number;
  contingencyRate?: number;
}

export type KpiDirection = 'increase' | 'decrease';

export interface KPI {
  id: string;
  label: string;
  target: number;
  actual: number;
  direction: KpiDirection;
  tolerance?: number;
  unit?: string;
  trend?: number[];
}

export interface BudgetState {
  planA: BudgetPlanAInput;
  planB: BudgetPlanBInput;
  planC: BudgetPlanCInput;
}

export interface AppState {
  tasks: Task[];
  milestones: Milestone[];
  budget: BudgetState;
  kpis: KPI[];
  lastUpdated: string;
  version: number;
}
