import { BanknotesIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { formatCurrency } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface BudgetPanelProps {
  isLoading?: boolean
}

export function BudgetPanel({ isLoading = false }: BudgetPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return <Skeleton className="h-64" />
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to review budget details." icon={BanknotesIcon} />
  }

  const remainingBudget = plan.budgetTotal - plan.budgetSpent
  const remainingPercentage = (remainingBudget / plan.budgetTotal) * 100

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <h3 className="text-lg font-semibold text-white">Summary</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-slate-400">Total Budget</dt>
            <dd className="text-xl font-semibold text-white">{formatCurrency(plan.budgetTotal)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Spent to Date</dt>
            <dd className="text-xl font-semibold text-white">{formatCurrency(plan.budgetSpent)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Remaining</dt>
            <dd className="text-xl font-semibold text-green-400">{formatCurrency(remainingBudget)}</dd>
            <dd className="text-xs text-slate-500">{Math.round(remainingPercentage)}% of total</dd>
          </div>
        </dl>
      </div>

      <div className="lg:col-span-2">
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-6 text-center">
          <p className="text-sm text-slate-400">
            Detailed budget allocation charts and spend analysis will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
