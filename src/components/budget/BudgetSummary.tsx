import { useBudgetStore } from '../../store/budgetStore';
import { calculateBudgetSummary, calculateBurnRate } from '../../lib/budgetCalculators';

export function BudgetSummary() {
  const { startingCapital, budgetItems } = useBudgetStore();
  const summary = calculateBudgetSummary(budgetItems, startingCapital);
  const burnRate = calculateBurnRate(budgetItems);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-surface rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-sm mb-1">Starting Capital</div>
        <div className="text-2xl font-semibold text-white">
          {formatCurrency(summary.startingCapital)}
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-sm mb-1">Allocated</div>
        <div className="text-2xl font-semibold text-accent">
          {formatCurrency(summary.totalAllocated)}
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-sm mb-1">Remaining</div>
        <div className="text-2xl font-semibold text-success">
          {formatCurrency(summary.remainingCapital)}
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-sm mb-1">Monthly Burn Rate</div>
        <div className="text-2xl font-semibold text-warning">
          {formatCurrency(burnRate)}
        </div>
      </div>
    </div>
  );
}
