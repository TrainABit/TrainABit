import { RiskProbability, RiskSeverity } from './enums';

export interface Risk {
  id: string;
  planId: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  probability: RiskProbability;
  impact: string;
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
  lastReviewed: string;
  nextReview: string;
}

export type RiskInput = Omit<Risk, 'id'> & { id?: string };
