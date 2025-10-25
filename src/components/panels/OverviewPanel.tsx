import { CalendarIcon, ChartBarIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { formatCurrency, formatDate } from '../../utils/format'
import { ProgressBar } from '../common/ProgressBar'
import { Skeleton } from '../common/Skeleton'

interface OverviewPanelProps {
  isLoading?: boolean
}

export function OverviewPanel({ isLoading = false }: OverviewPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (!plan) {
    return <p className="text-slate-400">No plan selected</p>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
            <p className="mt-1 text-slate-400">{plan.description}</p>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-primary/20 px-4 py-2">
            <span className="text-3xl font-bold text-primary">{plan.progress}%</span>
          </div>
        </div>
        <ProgressBar value={plan.progress} showLabel />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="rounded-md bg-primary/20 p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <dl className="mt-4">
            <dt className="text-sm text-slate-400">Budget Spent</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">
              {formatCurrency(plan.budgetSpent)}
            </dd>
            <dd className="mt-1 text-xs text-slate-500">
              of {formatCurrency(plan.budgetTotal)} total
            </dd>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="rounded-md bg-green-500/20 p-2">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <dl className="mt-4">
            <dt className="text-sm text-slate-400">Tasks Completed</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{plan.tasksCompleted}</dd>
            <dd className="mt-1 text-xs text-slate-500">of {plan.tasksTotal} total</dd>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="rounded-md bg-amber-500/20 p-2">
              <CalendarIcon className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <dl className="mt-4">
            <dt className="text-sm text-slate-400">Next Milestone</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {plan.nextMilestone ? plan.nextMilestone.title : 'TBD'}
            </dd>
            <dd className="mt-1 text-xs text-slate-500">
              {plan.nextMilestone ? formatDate(plan.nextMilestone.dueDate) : '—'}
            </dd>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="rounded-md bg-purple-500/20 p-2">
              <ChartBarIcon className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <dl className="mt-4">
            <dt className="text-sm text-slate-400">KPIs Tracked</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{plan.kpis.length}</dd>
            <dd className="mt-1 text-xs text-slate-500">active metrics</dd>
          </dl>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-md border border-slate-700 bg-slate-800 p-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-slate-400">{kpi.label}</dt>
                {kpi.trend && (
                  <span
                    className={`text-xs font-medium ${
                      kpi.trend === 'up'
                        ? 'text-green-400'
                        : kpi.trend === 'down'
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
              <dd className="mt-2 text-xl font-semibold text-white">{kpi.value}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
