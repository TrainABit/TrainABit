import { TasksBoard } from '../tasks/TasksBoard'

interface TasksPanelProps {
  isLoading?: boolean
}

export function TasksPanel({ isLoading = false }: TasksPanelProps) {
  if (isLoading) {
    return <div className="text-slate-400">Loading...</div>
  }

  return <TasksBoard />
}
