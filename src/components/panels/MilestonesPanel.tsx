import { FlagIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { formatDate } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface MilestonesPanelProps {
  isLoading?: boolean
}

export function MilestonesPanel({ isLoading = false }: MilestonesPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`milestone-skeleton-${index}`} className="h-20" />
        ))}
      </div>
    )
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to review its milestones." icon={FlagIcon} />
  }

  if (!plan.milestones.length) {
    return <EmptyState title="No milestones" description="Milestones for this plan will appear here when added." icon={FlagIcon} />
  }

  return (
    <div className="space-y-4">
      {plan.milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="flex items-start justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
        >
          <div>
            <h3 className="font-semibold text-white">{milestone.title}</h3>
            <p className="mt-1 text-sm text-slate-400">Due {formatDate(milestone.dueDate)}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${
              milestone.status === 'completed'
                ? 'bg-green-500/20 text-green-400'
                : milestone.status === 'in-progress'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {milestone.status.replace('-', ' ')}
          </span>
        </div>
      ))}
    </div>
  )
}
