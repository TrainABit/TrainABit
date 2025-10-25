import type { KPIMetric } from '../types/kpi';
import { KPIStatus } from '../types/enums';

/**
 * Calculate KPI status counts
 */
export function calculateKpiStatusCounts(kpis: KPIMetric[]): Record<KPIStatus, number> {
  const counts: Record<KPIStatus, number> = {
    [KPIStatus.ON_TRACK]: 0,
    [KPIStatus.AT_RISK]: 0,
    [KPIStatus.OFF_TRACK]: 0,
    [KPIStatus.ACHIEVED]: 0,
  };

  kpis.forEach(kpi => {
    counts[kpi.status] = (counts[kpi.status] || 0) + 1;
  });

  return counts;
}
