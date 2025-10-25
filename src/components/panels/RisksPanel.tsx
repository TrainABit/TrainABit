import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface RisksPanelProps {
  isLoading?: boolean
}

export function RisksPanel({ isLoading = false }: RisksPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`risk-skeleton-${index}`} className="h-20" />
        ))}
      </div>
    )
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to review its risk register." icon={ExclamationTriangleIcon} />
  }

  return (
    <div className="space-y-4">
      <EmptyState
        title="Risk register coming soon"
        description="Detailed risk tracking and mitigation plans will be added here in upcoming iterations."
        icon={ExclamationTriangleIcon}
      />
      {plan.tasks.map((task) => (
        <div
          key={`risk-${task.id}`}
          className="rounded-lg border border-slate-700 bg-slate-800/50 p-4"
        >
          <h3 className="font-semibold text-white">Risk placeholder for {task.title}</h3>
          <p className="mt-2 text-sm text-slate-400">
            Potential risk impact and mitigation strategies will be documented as part of the detailed risk assessment.
          </p>
        </div>
      ))}
    </div>
  )
}
