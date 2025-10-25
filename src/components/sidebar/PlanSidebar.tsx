import { useMemo } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import type { PlanId } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'
import { ProgressBar } from '../common/ProgressBar'
import { PlanCard } from './PlanCard'

interface PlanSidebarProps {
  onCollapseRequest?: () => void
}

export function PlanSidebar({ onCollapseRequest }: PlanSidebarProps) {
  const { plans, selectedPlanId, setSelectedPlan } = usePlanStore((state) => ({
    plans: state.plans,
    selectedPlanId: state.selectedPlanId,
    setSelectedPlan: state.setSelectedPlan,
  }))

  const selectedPlan = plans[selectedPlanId]

  const quickStats = useMemo(() => {
    if (!selectedPlan) {
      return []
    }

    const budgetRemaining = selectedPlan.budgetTotal - selectedPlan.budgetSpent

    return [
      {
        label: 'Budget Remaining',
        value: formatCurrency(budgetRemaining),
      },
      {
        label: 'Tasks Complete',
        value: `${selectedPlan.tasksCompleted}/${selectedPlan.tasksTotal}`,
      },
      {
        label: 'Next Milestone',
        value: selectedPlan.nextMilestone
          ? `${selectedPlan.nextMilestone.title} • ${formatDate(selectedPlan.nextMilestone.dueDate)}`
          : 'TBD',
      },
    ]
  }, [selectedPlan])

  const planEntries = useMemo(() => Object.values(plans), [plans])

  const handleSelect = (planId: PlanId) => {
    setSelectedPlan(planId)
    if (onCollapseRequest) {
      onCollapseRequest()
    }
  }

  return (
    <div className="flex h-full flex-col bg-surface text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Plan Summary</h2>
          <p className="text-sm text-slate-400">Switch between plans to compare progress</p>
        </div>
        {onCollapseRequest && (
          <button
            onClick={onCollapseRequest}
            className="rounded-md border border-slate-600 p-2 text-slate-300 hover:border-slate-500 hover:text-white md:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-b border-slate-700 px-6 py-5">
        {selectedPlan ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Overall Progress</span>
                <span className="font-medium text-slate-100">{selectedPlan.progress}%</span>
              </div>
              <ProgressBar value={selectedPlan.progress} className="mt-2" />
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm text-slate-300">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-md bg-slate-800/60 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Select a plan to preview its progress.</p>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {planEntries.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={plan.id === selectedPlanId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  )
}
