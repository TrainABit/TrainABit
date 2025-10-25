import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { TaskStatus, Task } from '../../types'
import { SortableTaskCard } from './SortableTaskCard'
import { ProgressBar } from '../common/ProgressBar'

interface TaskColumnProps {
  status: TaskStatus
  label: string
  color: string
  tasks: Task[]
  completionPercent: number
  onEditTask: (task: Task) => void
}

export function TaskColumn({
  status,
  label,
  color,
  tasks,
  completionPercent,
  onEditTask,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status },
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] flex-col rounded-lg border-2 ${
        isOver ? 'border-primary bg-primary/5' : 'border-slate-700 bg-slate-800/40'
      } p-4 transition-colors`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${color}`} />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">{label}</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-200">
            {tasks.length}
          </span>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="mb-4">
          <ProgressBar value={completionPercent} showLabel className="h-2" />
        </div>
      )}

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No tasks</p>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
