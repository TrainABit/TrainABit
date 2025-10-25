import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface NotesPanelProps {
  isLoading?: boolean
}

export function NotesPanel({ isLoading = false }: NotesPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return <Skeleton className="h-64" />
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to add or view notes." icon={DocumentTextIcon} />
  }

  return (
    <div>
      <EmptyState
        title="No notes yet"
        description="Add notes to capture important insights, meeting minutes, or decision records for this plan."
        icon={DocumentTextIcon}
        action={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Add Note
          </button>
        }
      />
    </div>
  )
}
