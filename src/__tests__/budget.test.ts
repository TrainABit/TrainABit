import { describe, expect, it } from 'vitest';

import { calculatePlanADscr, calculatePlanBRunway, calculatePlanCAcquisitionRollup } from '../domain/budget';

describe('budget calculators', () => {
  it('computes DSCR and highlights surplus and shortfall', () => {
    const healthy = calculatePlanADscr({ netOperatingIncome: 200000, totalDebtService: 140000, minimumRatio: 1.25 });
    expect(healthy.status).toBe('healthy');
    expect(healthy.surplus).toBeGreaterThan(0);
    expect(healthy.shortfall).toBeUndefined();

    const critical = calculatePlanADscr({ netOperatingIncome: 90000, totalDebtService: 120000, minimumRatio: 1.25 });
    expect(critical.status).toBe('critical');
    expect(critical.shortfall).toBeGreaterThan(0);
  });

  it('projects runway and recommended burn adjustments', () => {
    const result = calculatePlanBRunway({ cashOnHand: 150000, monthlyBurn: 30000, growthRate: 0.1, additionalFunding: 0 });

    expect(result.runwayMonths).toBeGreaterThan(3);
    expect(['healthy', 'watch', 'critical']).toContain(result.status);

    const stressed = calculatePlanBRunway({ cashOnHand: 60000, monthlyBurn: 25000, growthRate: 0, additionalFunding: 0 });
    expect(stressed.status).toBe('critical');
    expect(stressed.recommendedMonthlyCut).toBeGreaterThanOrEqual(0);
  });

  it('evaluates acquisition roll-up impact', () => {
    const result = calculatePlanCAcquisitionRollup({
      budget: 500000,
      contingencyRate: 0.2,
      synergySavings: 60000,
      acquisitions: [
        { id: 'a1', name: 'FocusFlow', price: 150000, integrationCost: 30000, expectedSynergy: 20000 },
        { id: 'a2', name: 'DailyZen', price: 100000, integrationCost: 15000 }
      ]
    });

    expect(result.acquisitionCount).toBe(2);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.remainingBudget).toBeLessThanOrEqual(500000);
  });
});
