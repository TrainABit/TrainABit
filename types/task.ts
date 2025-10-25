import { TaskStatus } from './enums';

export interface Task {
  id: string;
  planId: string;
  milestoneId?: string;
  title: string;
  description: string;
  dueDate: string;
  owner: string;
  assignee: string;
  status: TaskStatus;
  percentComplete: number;
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  remarks?: string;
}

export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'percentComplete'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  percentComplete?: number;
};
