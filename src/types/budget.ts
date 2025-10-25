export type PlanKey = 'planA' | 'planB' | 'planC';

export type BudgetCategory = 'capex' | 'opex' | 'financing';

export interface BudgetItem {
  id: string;
  plan: PlanKey;
  category: BudgetCategory;
  name: string;
  allocation: number;
  spent: number;
  notes?: string;
  isPaid?: boolean;
  calculatorMetadata?: Record<string, unknown>;
}

export interface PlanALinkedBudgetItems {
  equityInjectionItemId?: string;
  workingCapitalItemId?: string;
  qoeItemId?: string;
  marketingItemId?: string;
}

export interface PlanAInputs {
  purchasePrice: number;
  equityInjectionPercent: number;
  interestRate: number;
  amortizationYears: number;
  projectedEBITDA: number;
  workingCapital: number;
  qoeLegal: number;
  marketingBudget: number;
}

export interface DebtScheduleEntry {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface PlanAResults {
  loanAmount: number;
  equityInjectionAmount: number;
  monthlyDebtService: number;
  annualDebtService: number;
  dscr: number;
  cashOnCash: number;
  schedule: DebtScheduleEntry[];
  totalInterest24Months: number;
  totalPrincipal24Months: number;
  remainingBalanceAfter24Months: number;
}

export interface PlanBInputs {
  burnTeam: number;
  burnGTM: number;
  burnCompliance: number;
  burnInfra: number;
  currentArr: number;
  marginAssumption: number;
  cac: number;
  paybackPeriodMonths: number;
}

export interface PlanBResults {
  totalBurn: number;
  runwayMonths: number;
  arrMilestones: { month: number; arr: number }[];
  arrSeries: { month: number; arr: number; margin: number }[];
  marginAchievedInMonth?: number;
  monthlyNetMargin: number;
}

export interface AcquisitionInput {
  id: string;
  name: string;
  arr: number;
  purchaseMultiple: number;
  cashDown: number;
  sellerNotePercent: number;
  earnoutPercent: number;
}

export interface PlanCInputs {
  acquisitions: AcquisitionInput[];
  postIntegrationMarginPercent: number;
}

export interface PlanCResults {
  totalARR: number;
  weightedMultiple: number;
  totalCashDown: number;
  totalSellerNotes: number;
  totalEarnouts: number;
  projectedSDE: number;
  totalPurchasePrice: number;
}

export interface BudgetSummary {
  startingCapital: number;
  totalAllocated: number;
  totalSpent: number;
  remainingCapital: number;
}
