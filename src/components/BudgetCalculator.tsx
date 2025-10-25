import { useMemo, useState } from 'react';

import { calculatePlanADscr, calculatePlanBRunway, calculatePlanCAcquisitionRollup } from '../domain/budget';
import type { BudgetPlanAInput, BudgetPlanBInput, BudgetPlanCInput } from '../types';

export interface BudgetCalculatorProps {
  initialPlanA: BudgetPlanAInput;
  initialPlanB: BudgetPlanBInput;
  initialPlanC: BudgetPlanCInput;
}

const toNumber = (value: string): number => {
  if (value.trim() === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const BudgetCalculator = ({
  initialPlanA,
  initialPlanB,
  initialPlanC
}: BudgetCalculatorProps) => {
  const [planA, setPlanA] = useState<BudgetPlanAInput>({ ...initialPlanA });
  const [planB, setPlanB] = useState<BudgetPlanBInput>({ ...initialPlanB });
  const [planC, setPlanC] = useState<BudgetPlanCInput>({
    ...initialPlanC,
    acquisitions: initialPlanC.acquisitions.map((acquisition) => ({ ...acquisition }))
  });

  const planAResult = useMemo(() => calculatePlanADscr(planA), [planA]);
  const planBResult = useMemo(() => calculatePlanBRunway(planB), [planB]);
  const planCResult = useMemo(() => calculatePlanCAcquisitionRollup(planC), [planC]);

  return (
    <section aria-label="Budget calculator">
      <h2>Budget scenarios</h2>

      <article aria-label="Plan A debt service coverage">
        <h3>Plan A · DSCR</h3>
        <label>
          Net operating income
          <input
            type="number"
            name="planA-noi"
            aria-label="Net operating income"
            value={planA.netOperatingIncome}
            onChange={(event) =>
              setPlanA((previous) => ({
                ...previous,
                netOperatingIncome: toNumber(event.target.value)
              }))
            }
          />
        </label>
        <label>
          Total debt service
          <input
            type="number"
            name="planA-debt"
            aria-label="Total debt service"
            value={planA.totalDebtService}
            onChange={(event) =>
              setPlanA((previous) => ({
                ...previous,
                totalDebtService: Math.max(1, toNumber(event.target.value))
              }))
            }
          />
        </label>
        <p role="status" aria-live="polite">
          DSCR is {planAResult.ratio.toFixed(2)} ({planAResult.status})
        </p>
      </article>

      <article aria-label="Plan B runway">
        <h3>Plan B · Runway</h3>
        <label>
          Monthly burn
          <input
            type="number"
            name="planB-burn"
            aria-label="Monthly burn"
            value={planB.monthlyBurn}
            onChange={(event) =>
              setPlanB((previous) => ({
                ...previous,
                monthlyBurn: toNumber(event.target.value)
              }))
            }
          />
        </label>
        <label>
          Cash on hand
          <input
            type="number"
            name="planB-cash"
            aria-label="Cash on hand"
            value={planB.cashOnHand}
            onChange={(event) =>
              setPlanB((previous) => ({
                ...previous,
                cashOnHand: toNumber(event.target.value)
              }))
            }
          />
        </label>
        <p role="status" aria-live="polite">
          Runway covers {planBResult.runwayMonths.toFixed(1)} months ({planBResult.status}).
        </p>
      </article>

      <article aria-label="Plan C acquisition roll-up">
        <h3>Plan C · Acquisition roll-up</h3>
        <label>
          Portfolio budget
          <input
            type="number"
            name="planC-budget"
            aria-label="Portfolio budget"
            value={planC.budget}
            onChange={(event) =>
              setPlanC((previous) => ({
                ...previous,
                budget: toNumber(event.target.value)
              }))
            }
          />
        </label>
        <label>
          Synergy savings
          <input
            type="number"
            name="planC-synergy"
            aria-label="Synergy savings"
            value={planC.synergySavings ?? 0}
            onChange={(event) =>
              setPlanC((previous) => ({
                ...previous,
                synergySavings: toNumber(event.target.value)
              }))
            }
          />
        </label>
        <p role="status" aria-live="polite">
          Net spend {planCResult.totalCost.toLocaleString()} · Remaining budget {planCResult.remainingBudget.toLocaleString()}
        </p>
      </article>
    </section>
  );
};
