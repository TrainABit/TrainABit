import type { KPI } from '../types';

export type KPIStatus = 'on_track' | 'at_risk' | 'off_track';

export interface DerivedKpiStatus {
  id: string;
  label: string;
  status: KPIStatus;
  variance: number;
  meetsTarget: boolean;
  normalizedVariance: number;
  trendSlope: number;
}

const toTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const deriveVariance = (kpi: KPI): number => {
  const rawDelta = kpi.actual - kpi.target;

  if (kpi.direction === 'increase') {
    return rawDelta;
  }

  return -rawDelta;
};

const resolveTolerance = (target: number, tolerance?: number): number => {
  if (tolerance === undefined) {
    return target * 0.05;
  }

  return tolerance <= 1 ? target * tolerance : tolerance;
};

const resolveStatus = (variance: number, tolerance: number): KPIStatus => {
  if (variance >= -tolerance) {
    return variance >= 0 ? 'on_track' : 'at_risk';
  }

  if (variance >= -tolerance * 2) {
    return 'at_risk';
  }

  return 'off_track';
};

const deriveTrendSlope = (trend: number[] = []): number => {
  if (trend.length < 2) {
    return 0;
  }

  const first = trend[0];
  const last = trend[trend.length - 1];
  const slope = (last - first) / (trend.length - 1);

  return toTwoDecimals(slope);
};

export const deriveKpiStatus = (kpi: KPI): DerivedKpiStatus => {
  const variance = deriveVariance(kpi);
  const tolerance = resolveTolerance(kpi.target, kpi.tolerance);
  const status = resolveStatus(variance, tolerance);
  const meetsTarget = variance >= 0;
  const normalizedVariance = toTwoDecimals(
    kpi.target === 0 ? variance : variance / Math.abs(kpi.target)
  );

  return {
    id: kpi.id,
    label: kpi.label,
    status,
    variance: toTwoDecimals(variance),
    meetsTarget,
    normalizedVariance,
    trendSlope: deriveTrendSlope(kpi.trend)
  };
};

export interface KpiPortfolioSummary {
  statuses: DerivedKpiStatus[];
  onTrack: number;
  atRisk: number;
  offTrack: number;
}

export const summarizeKpiStatuses = (kpis: KPI[]): KpiPortfolioSummary => {
  const statuses = kpis.map((kpi) => deriveKpiStatus(kpi));
  const onTrack = statuses.filter((item) => item.status === 'on_track').length;
  const atRisk = statuses.filter((item) => item.status === 'at_risk').length;
  const offTrack = statuses.filter((item) => item.status === 'off_track').length;

  return {
    statuses,
    onTrack,
    atRisk,
    offTrack
  };
};
