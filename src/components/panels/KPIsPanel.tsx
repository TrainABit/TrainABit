import { ChartBarIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface KPIsPanelProps {
  isLoading?: boolean
}

export function KPIsPanel({ isLoading = false }: KPIsPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return <Skeleton className="h-64" />
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to review its KPIs." icon={ChartBarIcon} />
  }

  if (!plan.kpis.length) {
    return <EmptyState title="No KPIs" description="KPIs for this plan will appear here when added." icon={ChartBarIcon} />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plan.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-400">{kpi.label}</h3>
              {kpi.trend && (
                <span
                  className={`text-lg font-bold ${
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
            <p className="mt-3 text-3xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
