import { describe, expect, it } from 'vitest';

import { deriveKpiStatus, summarizeKpiStatuses } from '../domain/kpi';
import type { KPI } from '../types';

describe('kpi status derivations', () => {
  it('returns on-track when direction is achieved', () => {
    const kpi: KPI = {
      id: 'kpi-1',
      label: 'Activation rate',
      target: 45,
      actual: 47,
      direction: 'increase',
      tolerance: 0.05,
      trend: [30, 35, 40, 47]
    };

    const status = deriveKpiStatus(kpi);

    expect(status.status).toBe('on_track');
    expect(status.meetsTarget).toBe(true);
    expect(status.trendSlope).toBeGreaterThan(0);
  });

  it('flags off-track metrics beyond tolerance', () => {
    const kpi: KPI = {
      id: 'kpi-2',
      label: 'Support SLAs',
      target: 95,
      actual: 88,
      direction: 'increase',
      tolerance: 2,
      trend: [96, 94, 93, 88]
    };

    const status = deriveKpiStatus(kpi);

    expect(status.status).toBe('off_track');
    expect(status.meetsTarget).toBe(false);
    expect(status.variance).toBeLessThan(0);
  });

  it('summarizes portfolio', () => {
    const kpis: KPI[] = [
      { id: 'kpi-1', label: 'NPS', target: 50, actual: 55, direction: 'increase' },
      { id: 'kpi-2', label: 'Churn', target: 4, actual: 5, direction: 'decrease', tolerance: 0.5 },
      { id: 'kpi-3', label: 'Revenue', target: 100000, actual: 95000, direction: 'increase', tolerance: 0.1 }
    ];

    const summary = summarizeKpiStatuses(kpis);

    expect(summary.statuses).toHaveLength(3);
    expect(summary.onTrack + summary.atRisk + summary.offTrack).toBe(3);
  });
});
