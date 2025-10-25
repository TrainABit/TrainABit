import type { Plan, PlanId } from '../../types'
import { ProgressBar } from '../common/ProgressBar'

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: (planId: PlanId) => void
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <button
      onClick={() => onSelect(plan.id)}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-100">{plan.name}</h3>
        <div
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            isSelected ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          {plan.progress}%
        </div>
      </div>
      <p className="mb-3 text-xs text-slate-400">{plan.description}</p>
      <ProgressBar value={plan.progress} />
    </button>
  )
}
