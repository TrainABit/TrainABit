import { useState } from 'react'
import { FlagIcon, PlusIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import type { Milestone } from '../../types'
import { MilestoneCard } from './MilestoneCard'
import { MilestoneModal } from './MilestoneModal'
import { format, parseISO } from 'date-fns'

export function MilestoneTimeline() {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)

  const plan = plans[selectedPlanId]

  const sortedMilestones = [...plan.milestones].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  )

  const handleCreateMilestone = () => {
    setEditingMilestone(null)
    setIsModalOpen(true)
  }

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Milestones</h2>
          <p className="mt-1 text-sm text-slate-400">
            {plan.milestones.length} total milestones
          </p>
        </div>
        <button
          onClick={handleCreateMilestone}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <PlusIcon className="h-5 w-5" />
          Add Milestone
        </button>
      </div>

      {sortedMilestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 py-12">
          <FlagIcon className="h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-lg font-medium text-slate-400">No milestones yet</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating your first milestone.</p>
          <button
            onClick={handleCreateMilestone}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Create Milestone
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-0.5 bg-slate-700" />
          <div className="space-y-8">
            {sortedMilestones.map((milestone) => (
              <div key={milestone.id} className="relative">
                <div className="flex items-start gap-6">
                  <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-slate-900 bg-slate-800">
                    <FlagIcon
                      className={`h-8 w-8 ${
                        milestone.status === 'complete'
                          ? 'text-green-400'
                          : milestone.status === 'tracking'
                          ? 'text-blue-400'
                          : milestone.status === 'at-risk'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                        <p className="text-sm text-slate-400">
                          Target: {format(parseISO(milestone.targetDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                          milestone.status === 'complete'
                            ? 'bg-green-500/20 text-green-300'
                            : milestone.status === 'tracking'
                            ? 'bg-blue-500/20 text-blue-300'
                            : milestone.status === 'at-risk'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {milestone.status.replace('-', ' ')}
                      </span>
                    </div>
                    <MilestoneCard
                      milestone={milestone}
                      planId={selectedPlanId}
                      onEdit={handleEditMilestone}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <MilestoneModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingMilestone(null)
        }}
        milestone={editingMilestone}
        planId={selectedPlanId}
      />
    </>
  )
}
