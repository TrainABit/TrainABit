import type { BudgetPlanAInput, BudgetPlanBInput, BudgetPlanCInput } from '../types';

export type FinancialHealthStatus = 'healthy' | 'watch' | 'critical';

export interface PlanAResult {
  ratio: number;
  status: FinancialHealthStatus;
  minimum: number;
  surplus?: number;
  shortfall?: number;
}

export interface PlanBResult {
  runwayMonths: number;
  status: FinancialHealthStatus;
  normalizedBurn: number;
  runwayEndDate: string;
  recommendedMonthlyCut?: number;
}

export interface PlanCResult {
  totalCost: number;
  remainingBudget: number;
  overBudget: boolean;
  requiredSynergy: number;
  acquisitionCount: number;
}

const toTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const resolveStatus = (value: number, ideal: number): FinancialHealthStatus => {
  if (value >= ideal) {
    return 'healthy';
  }

  if (value >= ideal * 0.85) {
    return 'watch';
  }

  return 'critical';
};

export const calculatePlanADscr = (input: BudgetPlanAInput): PlanAResult => {
  if (input.totalDebtService <= 0) {
    throw new Error('Total debt service must be greater than zero');
  }

  const minimum = input.minimumRatio ?? 1.25;
  const ratio = input.netOperatingIncome / input.totalDebtService;
  const difference = toTwoDecimals(ratio - minimum);
  const status = resolveStatus(ratio, minimum);
  const surplus = difference > 0 ? difference : undefined;
  const shortfall = difference < 0 ? Math.abs(difference) : undefined;

  return {
    ratio: toTwoDecimals(ratio),
    status,
    minimum,
    surplus,
    shortfall
  };
};

const monthsToIsoDate = (months: number, referenceDate: Date): string => {
  const wholeMonths = Math.floor(months);
  const remainingDays = Math.round((months - wholeMonths) * 30);
  const result = new Date(referenceDate);
  result.setMonth(result.getMonth() + wholeMonths);
  result.setDate(result.getDate() + remainingDays);

  return result.toISOString().split('T')[0];
};

export const calculatePlanBRunway = (
  input: BudgetPlanBInput,
  referenceDate = new Date()
): PlanBResult => {
  const growthRate = input.growthRate ?? 0;
  const additionalFunding = input.additionalFunding ?? 0;
  const normalizedBurn = input.monthlyBurn * (1 + growthRate);
  const available = input.cashOnHand + additionalFunding;

  if (normalizedBurn <= 0) {
    return {
      runwayMonths: Number.POSITIVE_INFINITY,
      status: 'healthy',
      normalizedBurn,
      runwayEndDate: monthsToIsoDate(60, referenceDate)
    };
  }

  const runwayMonths = available / normalizedBurn;
  const status = runwayMonths >= 12 ? 'healthy' : runwayMonths >= 6 ? 'watch' : 'critical';
  const desiredMonths = 12;
  const recommendedMonthlyCut = runwayMonths >= desiredMonths
    ? undefined
    : Math.max(0, toTwoDecimals(normalizedBurn - available / desiredMonths));

  return {
    runwayMonths: toTwoDecimals(runwayMonths),
    status,
    normalizedBurn: toTwoDecimals(normalizedBurn),
    runwayEndDate: monthsToIsoDate(runwayMonths, referenceDate),
    recommendedMonthlyCut
  };
};

export const calculatePlanCAcquisitionRollup = (input: BudgetPlanCInput): PlanCResult => {
  const contingencyRate = input.contingencyRate ?? 0.1;
  const baseCost = input.acquisitions.reduce((acc, acquisition) => {
    const integrationCost = acquisition.integrationCost ?? acquisition.price * 0.15;
    return acc + acquisition.price + integrationCost;
  }, 0);

  const synergySavingsFromDeals = input.acquisitions.reduce((acc, acquisition) => {
    return acc + (acquisition.expectedSynergy ?? 0);
  }, 0);

  const synergySavings = input.synergySavings ?? synergySavingsFromDeals;
  const totalCost = baseCost * (1 + contingencyRate);
  const netSpend = totalCost - synergySavings;
  const remainingBudget = toTwoDecimals(input.budget - netSpend);
  const overBudget = remainingBudget < 0;
  const requiredSynergy = overBudget ? Math.abs(remainingBudget) : 0;

  return {
    totalCost: toTwoDecimals(totalCost),
    remainingBudget,
    overBudget,
    requiredSynergy: toTwoDecimals(requiredSynergy),
    acquisitionCount: input.acquisitions.length
  };
};
