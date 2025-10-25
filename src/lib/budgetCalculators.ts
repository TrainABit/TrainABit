import type {
  PlanAInputs,
  PlanAResults,
  PlanBInputs,
  PlanBResults,
  PlanCInputs,
  PlanCResults,
  DebtScheduleEntry,
  BudgetItem,
  BudgetSummary,
} from '../types/budget';

export function calculatePlanA(inputs: PlanAInputs): PlanAResults {
  const {
    purchasePrice,
    equityInjectionPercent,
    interestRate,
    amortizationYears,
    projectedEBITDA,
  } = inputs;

  const equityInjectionAmount = purchasePrice * (equityInjectionPercent / 100);
  const loanAmount = purchasePrice - equityInjectionAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = amortizationYears * 12;

  const monthlyDebtService =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const annualDebtService = monthlyDebtService * 12;

  const noi = projectedEBITDA;
  const dscr = annualDebtService === 0 ? 0 : noi / annualDebtService;

  const firstYearCashFlow = projectedEBITDA - annualDebtService;
  const cashOnCash =
    equityInjectionAmount === 0 ? 0 : (firstYearCashFlow / equityInjectionAmount) * 100;

  const schedule: DebtScheduleEntry[] = [];
  let remainingBalance = loanAmount;

  for (let month = 1; month <= Math.min(24, numberOfPayments); month++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyDebtService - interest;
    remainingBalance -= principal;

    schedule.push({
      month,
      payment: monthlyDebtService,
      interest,
      principal,
      balance: remainingBalance,
    });
  }

  const totalInterest24Months = schedule.reduce((sum, entry) => sum + entry.interest, 0);
  const totalPrincipal24Months = schedule.reduce((sum, entry) => sum + entry.principal, 0);
  const remainingBalanceAfter24Months = schedule[schedule.length - 1]?.balance || loanAmount;

  return {
    loanAmount,
    equityInjectionAmount,
    monthlyDebtService,
    annualDebtService,
    dscr,
    cashOnCash,
    schedule,
    totalInterest24Months,
    totalPrincipal24Months,
    remainingBalanceAfter24Months,
  };
}

export function calculatePlanB(inputs: PlanBInputs, allocatedCapital: number): PlanBResults {
  const { burnTeam, burnGTM, burnCompliance, burnInfra, currentArr, marginAssumption, cac, paybackPeriodMonths } = inputs;

  const totalBurn = burnTeam + burnGTM + burnCompliance + burnInfra;
  const runwayMonths = totalBurn === 0 ? Infinity : allocatedCapital / totalBurn;

  const monthlyNetMargin = (currentArr * (marginAssumption / 100)) / 12;

  const arrSeries: { month: number; arr: number; margin: number }[] = [];
  let cumulativeArr = currentArr;
  let marginAchievedInMonth: number | undefined;

  const payback = Math.max(paybackPeriodMonths, 1);
  const acquisitionRate = cac === 0 ? 0 : burnGTM / cac;
  const annualRevenuePerCustomer = cac === 0 ? 0 : (cac / payback) * 12;

  for (let month = 1; month <= Math.min(36, runwayMonths); month++) {
    const monthlyMargin = (cumulativeArr * (marginAssumption / 100)) / 12;
    arrSeries.push({ month, arr: cumulativeArr, margin: monthlyMargin });

    if (monthlyMargin >= totalBurn && marginAchievedInMonth === undefined) {
      marginAchievedInMonth = month;
    }

    const newArr = acquisitionRate * annualRevenuePerCustomer;
    cumulativeArr += newArr;
  }

  const arrMilestones = [
    { month: 0, arr: currentArr },
    ...arrSeries
      .filter((_, idx) => idx % 6 === 5)
      .map((entry) => ({ month: entry.month, arr: entry.arr })),
  ];

  return {
    totalBurn,
    runwayMonths,
    arrMilestones,
    arrSeries,
    marginAchievedInMonth,
    monthlyNetMargin,
  };
}

export function calculatePlanC(inputs: PlanCInputs): PlanCResults {
  const { acquisitions, postIntegrationMarginPercent } = inputs;

  let totalARR = 0;
  let totalPurchasePrice = 0;
  let totalCashDown = 0;
  let totalSellerNotes = 0;
  let totalEarnouts = 0;

  acquisitions.forEach((acq) => {
    const purchasePrice = acq.arr * acq.purchaseMultiple;
    const cashDown = purchasePrice * (acq.cashDown / 100);
    const sellerNote = purchasePrice * (acq.sellerNotePercent / 100);
    const earnout = purchasePrice * (acq.earnoutPercent / 100);

    totalARR += acq.arr;
    totalPurchasePrice += purchasePrice;
    totalCashDown += cashDown;
    totalSellerNotes += sellerNote;
    totalEarnouts += earnout;
  });

  const weightedMultiple = totalARR === 0 ? 0 : totalPurchasePrice / totalARR;
  const projectedSDE = totalARR * (postIntegrationMarginPercent / 100);

  return {
    totalARR,
    weightedMultiple,
    totalCashDown,
    totalSellerNotes,
    totalEarnouts,
    projectedSDE,
    totalPurchasePrice,
  };
}

export function calculateBudgetSummary(
  items: BudgetItem[],
  startingCapital: number
): BudgetSummary {
  const totalAllocated = items.reduce((sum, item) => sum + item.allocation, 0);
  const totalSpent = items.reduce((sum, item) => sum + item.spent, 0);
  const remainingCapital = startingCapital - totalAllocated;

  return {
    startingCapital,
    totalAllocated,
    totalSpent,
    remainingCapital,
  };
}

export function calculateBurnRate(items: BudgetItem[]): number {
  const monthlyOpex = items
    .filter((item) => item.category === 'opex')
    .reduce((sum, item) => sum + item.allocation, 0);
  return monthlyOpex;
}
