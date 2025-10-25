import { useMemo, useState } from 'react';

import { calculateTaskProgress } from '../domain/progress';
import type { Task, TaskStatus } from '../types';

const STATUS_SEQUENCE: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done'];

const getNextStatus = (status: TaskStatus): TaskStatus => {
  const index = STATUS_SEQUENCE.indexOf(status);
  const nextIndex = (index + 1) % STATUS_SEQUENCE.length;

  return STATUS_SEQUENCE[nextIndex];
};

export interface TasksBoardProps {
  initialTasks: Task[];
  onTasksChange?: (tasks: Task[]) => void;
}

export const TasksBoard = ({ initialTasks, onTasksChange }: TasksBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => initialTasks.map((task) => ({ ...task })));
  const summary = useMemo(() => calculateTaskProgress(tasks), [tasks]);

  const handleStatusCycle = (taskId: string) => {
    setTasks((previous) => {
      const updated = previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: getNextStatus(task.status)
            }
          : task
      );

      onTasksChange?.(updated);
      return updated;
    });
  };

  return (
    <section aria-label="Tasks board" className="tasks-board">
      <header>
        <h2>Team Tasks</h2>
        <p role="status" aria-live="polite">
          {summary.completed} of {summary.total} tasks complete ({Math.round(summary.completionRate * 100)}%)
        </p>
      </header>

      <ul aria-label="Task list">
        {tasks.map((task) => {
          const statusLabel = task.status.replace('_', ' ');

          return (
            <li key={task.id} aria-label={`${task.title} status ${statusLabel}`}>
              <div>
                <span>{task.title}</span>
                <span aria-label="Task status" data-testid={`status-${task.id}`}>
                  {statusLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleStatusCycle(task.id)}
                aria-pressed={task.status === 'done'}
              >
                Advance status
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
