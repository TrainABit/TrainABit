/**
 * Enumerations and constants for the strategic planning application
 */

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PlanType {
  PLAN_A = 'plan_a',
  PLAN_B = 'plan_b',
  PLAN_C = 'plan_c',
}

export enum MilestoneStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
}

export enum BudgetCategory {
  DEVELOPMENT = 'development',
  MARKETING = 'marketing',
  OPERATIONS = 'operations',
  LEGAL = 'legal',
  INFRASTRUCTURE = 'infrastructure',
  TALENT = 'talent',
  ADVISORY = 'advisory',
  CONTINGENCY = 'contingency',
}

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RiskProbability {
  UNLIKELY = 'unlikely',
  POSSIBLE = 'possible',
  LIKELY = 'likely',
  VERY_LIKELY = 'very_likely',
}

export enum KPIStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  OFF_TRACK = 'off_track',
  ACHIEVED = 'achieved',
}

export enum ResourceType {
  ADVISOR = 'advisor',
  TOOL = 'tool',
  DOCUMENT = 'document',
  PARTNER = 'partner',
  VENDOR = 'vendor',
}

export enum ReviewCadence {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export const PLAN_NAMES: Record<PlanType, string> = {
  [PlanType.PLAN_A]: 'Quick Exit (6 months)',
  [PlanType.PLAN_B]: 'Sustainable Growth (18-24 months)',
  [PlanType.PLAN_C]: 'Premium Exit (36+ months)',
};

export const STORAGE_KEY = '10m-exit-planner-v1';
export const STORAGE_VERSION = 1;
