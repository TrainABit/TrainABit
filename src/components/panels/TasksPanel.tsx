import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface TasksPanelProps {
  isLoading?: boolean
}

export function TasksPanel({ isLoading = false }: TasksPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={`task-skeleton-${index}`} className="h-16" />
        ))}
      </div>
    )
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to review its tasks." icon={ClipboardDocumentListIcon} />
  }

  if (!plan.tasks.length) {
    return <EmptyState title="No tasks" description="Tasks for this plan will appear here when added." icon={ClipboardDocumentListIcon} />
  }

  return (
    <div className="space-y-3">
      {plan.tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              readOnly
              className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-primary"
            />
            <div>
              <h4 className={`font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                {task.title}
              </h4>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${
                task.priority === 'high'
                  ? 'bg-red-500/20 text-red-400'
                  : task.priority === 'medium'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {task.priority}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${
                task.status === 'completed'
                  ? 'bg-green-500/20 text-green-400'
                  : task.status === 'in-progress'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
