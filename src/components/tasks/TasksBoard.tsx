import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { usePlanStore } from '../../store/usePlanStore'
import type { TaskStatus, Task } from '../../types'
import { TaskColumn } from './TaskColumn'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'
import { PlusIcon } from '@heroicons/react/24/outline'

const statuses: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'backlog', label: 'Backlog', color: 'bg-slate-700' },
  { status: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { status: 'blocked', label: 'Blocked', color: 'bg-red-500' },
  { status: 'done', label: 'Done', color: 'bg-green-500' },
]

export function TasksBoard() {
  const { selectedPlanId, plans, moveTask } = usePlanStore((state) => ({
    selectedPlanId: state.selectedPlanId,
    plans: state.plans,
    moveTask: state.moveTask,
  }))

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const plan = plans[selectedPlanId]

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    backlog: [],
    'in-progress': [],
    blocked: [],
    done: [],
  }

  plan.tasks.forEach((task) => {
    tasksByStatus[task.status].push(task)
  })

  const handleDragStart = (event: DragStartEvent) => {
    const task = plan.tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const overColumnStatus = over.data.current?.status as TaskStatus | undefined
    const overTaskId = over.id as string

    if (overColumnStatus) {
      const targetTasks = tasksByStatus[overColumnStatus]
      const targetIndex = targetTasks.length
      moveTask(selectedPlanId, taskId, overColumnStatus, targetIndex)
    } else {
      const overTask = plan.tasks.find((t) => t.id === overTaskId)
      if (overTask) {
        const targetTasks = tasksByStatus[overTask.status]
        const targetIndex = targetTasks.findIndex((t) => t.id === overTaskId)
        moveTask(selectedPlanId, taskId, overTask.status, targetIndex)
      }
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const getTotalCompleted = (status: TaskStatus): number => {
    const tasks = tasksByStatus[status]
    if (tasks.length === 0) return 0
    const completed = tasks.filter((t) => t.percentComplete === 100).length
    return Math.round((completed / tasks.length) * 100)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <p className="mt-1 text-sm text-slate-400">
            {plan.tasks.length} total tasks • {tasksByStatus.done.length} completed
          </p>
        </div>
        <button
          onClick={handleCreateTask}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <PlusIcon className="h-5 w-5" />
          Add Task
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statuses.map(({ status, label, color }) => (
            <TaskColumn
              key={status}
              status={status}
              label={label}
              color={color}
              tasks={tasksByStatus[status]}
              completionPercent={getTotalCompleted(status)}
              onEditTask={handleEditTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 cursor-grabbing opacity-90">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        planId={selectedPlanId}
      />
    </>
  )
}
