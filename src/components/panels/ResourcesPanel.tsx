import { FolderOpenIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'

interface ResourcesPanelProps {
  isLoading?: boolean
}

export function ResourcesPanel({ isLoading = false }: ResourcesPanelProps) {
  const { selectedPlanId, plans } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
  }))

  const plan = plans[selectedPlanId]

  if (isLoading) {
    return <Skeleton className="h-64" />
  }

  if (!plan) {
    return <EmptyState title="No plan selected" description="Choose a plan to view its resource library." icon={FolderOpenIcon} />
  }

  return (
    <EmptyState
      title="Resource hub coming soon"
      description="Documentation, templates, and linked assets will appear here as they become available."
      icon={FolderOpenIcon}
      action={
        <button className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10">
          Upload resource
        </button>
      }
    />
  )
}
