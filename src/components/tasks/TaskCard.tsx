import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import type { Task } from '../../types'
import { formatDate } from '../../utils/format'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <div
      role="article"
      aria-label={`Task ${task.title}`}
      className="flex cursor-pointer flex-col gap-3 rounded-lg border border-slate-700 bg-slate-800/70 p-4 text-left shadow-sm transition hover:border-primary/70 hover:shadow-lg"
      onClick={() => onEdit?.(task)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onEdit?.(task)
        }
      }}
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{task.title}</h3>
          {task.assignee ? <p className="text-xs text-slate-400">Assigned to {task.assignee}</p> : null}
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium uppercase ${
            task.status === 'done'
              ? 'bg-green-500/20 text-green-300'
              : task.status === 'blocked'
              ? 'bg-red-500/20 text-red-300'
              : task.status === 'in-progress'
              ? 'bg-blue-500/20 text-blue-200'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          <ClipboardDocumentListIcon className="h-4 w-4" />
          {task.status.replace('-', ' ')}
        </span>
      </div>

      {task.description ? <p className="text-xs text-slate-400">{task.description}</p> : null}

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-700 px-2 py-1 font-medium text-slate-200">
            {task.percentComplete}% complete
          </span>
          {task.dueDate ? <span>Due {formatDate(task.dueDate)}</span> : null}
        </div>
        <button
          type="button"
          className="rounded-md border border-slate-600 px-2 py-1 text-xs font-medium text-slate-200 hover:border-primary/60 hover:text-primary"
          onClick={(event) => {
            event.stopPropagation()
            onEdit?.(task)
          }}
        >
          Edit
        </button>
      </div>
    </div>
  )
}
