import { MilestoneTimeline } from '../milestones/MilestoneTimeline'

interface MilestonesPanelProps {
  isLoading?: boolean
}

export function MilestonesPanel({ isLoading = false }: MilestonesPanelProps) {
  if (isLoading) {
    return <div className="text-slate-400">Loading...</div>
  }

  return <MilestoneTimeline />
}
