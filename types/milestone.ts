import { MilestoneStatus } from './enums';

export interface Milestone {
  id: string;
  planId: string;
  title: string;
  description: string;
  targetDate: string;
  startDate: string;
  status: MilestoneStatus;
  percentComplete: number;
  order: number;
  deliverables: string[];
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

export type MilestoneInput = Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'percentComplete'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  percentComplete?: number;
};
