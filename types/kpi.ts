import { KPIStatus, ReviewCadence } from './enums';

export interface KPIMetric {
  id: string;
  planId: string;
  name: string;
  description: string;
  unit: string;
  currentValue: number;
  targetValue: number;
  baselineValue: number;
  status: KPIStatus;
  reviewCadence: ReviewCadence;
  owner: string;
  lastReviewed: string;
  nextReview: string;
  trend?: 'up' | 'down' | 'stable';
  history?: Array<{
    date: string;
    value: number;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type KPIMetricInput = Omit<KPIMetric, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: KPIStatus;
};
