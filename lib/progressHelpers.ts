import type { Milestone } from '../types/milestone';
import type { Task } from '../types/task';
import { TaskStatus } from '../types/enums';

/**
 * Calculate progress percentage from tasks
 */
export function calculateProgressFromTasks(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  
  const totalProgress = tasks.reduce((sum, task) => sum + task.percentComplete, 0);
  return Math.round(totalProgress / tasks.length);
}

/**
 * Calculate progress percentage from milestones
 */
export function calculateProgressFromMilestones(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  
  const totalProgress = milestones.reduce((sum, milestone) => sum + milestone.percentComplete, 0);
  return Math.round(totalProgress / milestones.length);
}

/**
 * Calculate milestone completion based on its tasks
 */
export function calculateMilestoneCompletion(milestoneId: string, tasks: Task[]): number {
  const milestoneTasks = tasks.filter(task => task.milestoneId === milestoneId);
  return calculateProgressFromTasks(milestoneTasks);
}

/**
 * Count completed tasks
 */
export function countCompletedTasks(tasks: Task[]): number {
  return tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
}

/**
 * Count completed milestones
 */
export function countCompletedMilestones(milestones: Milestone[]): number {
  return milestones.filter(milestone => milestone.percentComplete === 100).length;
}

/**
 * Calculate task completion rate
 */
export function calculateTaskCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((countCompletedTasks(tasks) / tasks.length) * 100);
}

/**
 * Calculate milestone completion rate
 */
export function calculateMilestoneCompletionRate(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  return Math.round((countCompletedMilestones(milestones) / milestones.length) * 100);
}

/**
 * Calculate overall plan progress (weighted: 60% tasks, 40% milestones)
 */
export function calculatePlanProgress(tasks: Task[], milestones: Milestone[]): number {
  const taskProgress = calculateProgressFromTasks(tasks);
  const milestoneProgress = calculateProgressFromMilestones(milestones);
  
  return Math.round(taskProgress * 0.6 + milestoneProgress * 0.4);
}
