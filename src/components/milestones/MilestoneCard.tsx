import { usePlanStore } from '../../store/usePlanStore'
import type { Milestone, PlanId } from '../../types'
import { ProgressBar } from '../common/ProgressBar'
import { PencilIcon } from '@heroicons/react/24/outline'

interface MilestoneCardProps {
  milestone: Milestone
  planId: PlanId
  onEdit: (milestone: Milestone) => void
}

export function MilestoneCard({ milestone, planId, onEdit }: MilestoneCardProps) {
  const { plans } = usePlanStore((state) => ({
    plans: state.plans,
  }))

  const plan = plans[planId]
  const linkedTasks = plan.tasks.filter((task) => milestone.taskIds.includes(task.id))
  const completedTasks = linkedTasks.filter((task) => task.percentComplete === 100).length
  const totalTasks = linkedTasks.length

  const progress = totalTasks > 0 
    ? linkedTasks.reduce((sum, task) => sum + task.percentComplete, 0) / totalTasks 
    : 0

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {milestone.notes && (
            <p className="mb-3 text-sm text-slate-400">{milestone.notes}</p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">
              {completedTasks} of {totalTasks} tasks completed
            </span>
            {milestone.completionThreshold && (
              <span className="text-xs text-slate-500">
                • Threshold: {milestone.completionThreshold}%
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onEdit(milestone)}
          className="rounded-md border border-slate-600 p-2 text-slate-400 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Edit milestone"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>

      <ProgressBar value={progress} showLabel className="h-3" />

      {linkedTasks.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Linked Tasks
          </h4>
          <div className="space-y-1">
            {linkedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/40 px-3 py-2 text-sm"
              >
                <span className="text-slate-300">{task.title}</span>
                <span className="text-xs text-slate-500">{task.percentComplete}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
