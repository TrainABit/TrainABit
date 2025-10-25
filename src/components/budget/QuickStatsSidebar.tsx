import { calculatePlanA, calculatePlanB, calculatePlanC, calculateBudgetSummary } from '../../lib/budgetCalculators';
import { useBudgetStore } from '../../store/budgetStore';

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function QuickStatsSidebar() {
  const {
    startingCapital,
    budgetItems,
    planAInputs,
    planBInputs,
    planCInputs,
  } = useBudgetStore();

  const summary = calculateBudgetSummary(budgetItems, startingCapital);

  const planBAllocated = budgetItems
    .filter((item) => item.plan === 'planB')
    .reduce((sum, item) => sum + (item.allocation - item.spent), 0);

  const planAResults = calculatePlanA(planAInputs);
  const planBResults = calculatePlanB(planBInputs, Math.max(planBAllocated, 0));
  const planCResults = calculatePlanC(planCInputs);

  return (
    <aside className="space-y-6">
      <div className="rounded-xl border border-slate-700 bg-surface p-4">
        <h4 className="text-lg font-semibold text-white">Capital Snapshot</h4>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Remaining Capital</dt>
            <dd className="font-semibold text-success">{formatCurrency(summary.remainingCapital)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Total Spent</dt>
            <dd className="font-semibold text-warning">{formatCurrency(summary.totalSpent)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-700 bg-surface p-4">
        <h4 className="text-lg font-semibold text-white">Plan A · SBA 7(a)</h4>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">DSCR</dt>
            <dd className={planAResults.dscr >= 1.25 ? 'font-semibold text-success' : 'font-semibold text-warning'}>
              {planAResults.dscr.toFixed(2)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Monthly Debt Service</dt>
            <dd className="font-semibold text-slate-100">{formatCurrency(planAResults.monthlyDebtService)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Cash-on-Cash</dt>
            <dd className="font-semibold text-slate-100">{formatPercent(planAResults.cashOnCash)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-700 bg-surface p-4">
        <h4 className="text-lg font-semibold text-white">Plan B · Runway</h4>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Runway</dt>
            <dd className="font-semibold text-slate-100">
              {planBResults.runwayMonths === Infinity ? '∞' : `${planBResults.runwayMonths.toFixed(1)} months`}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Monthly Burn</dt>
            <dd className="font-semibold text-warning">{formatCurrency(planBResults.totalBurn)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Margin Breakeven</dt>
            <dd className="font-semibold text-slate-100">
              {planBResults.marginAchievedInMonth
                ? `Month ${planBResults.marginAchievedInMonth}`
                : 'Not within runway'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-700 bg-surface p-4">
        <h4 className="text-lg font-semibold text-white">Plan C · Roll-Up</h4>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Consolidated ARR</dt>
            <dd className="font-semibold text-slate-100">{formatCurrency(planCResults.totalARR)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Weighted Multiple</dt>
            <dd className="font-semibold text-slate-100">{planCResults.weightedMultiple.toFixed(2)}x</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Projected SDE</dt>
            <dd className="font-semibold text-success">{formatCurrency(planCResults.projectedSDE)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
