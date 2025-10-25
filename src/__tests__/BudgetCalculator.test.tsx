import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BudgetCalculator } from '../components/BudgetCalculator';

const planA = { netOperatingIncome: 120000, totalDebtService: 90000, minimumRatio: 1.2 };
const planB = { cashOnHand: 200000, monthlyBurn: 35000, growthRate: 0.05, additionalFunding: 0 };
const planC = {
  budget: 600000,
  synergySavings: 50000,
  contingencyRate: 0.1,
  acquisitions: [
    { id: 'a1', name: 'CalSync', price: 180000, integrationCost: 30000 },
    { id: 'a2', name: 'WeatherIQ', price: 120000, integrationCost: 20000 }
  ]
};

describe('BudgetCalculator component', () => {
  it('responds to input changes across plans', async () => {
    const user = userEvent.setup();

    render(<BudgetCalculator initialPlanA={planA} initialPlanB={planB} initialPlanC={planC} />);

    const dscrField = screen.getByLabelText(/net operating income/i);
    await user.clear(dscrField);
    await user.type(dscrField, '150000');

    const dscrStatus = screen.getAllByRole('status')[0];
    expect(dscrStatus.textContent).toMatch(/DSCR is/);

    const burnField = screen.getByLabelText(/monthly burn/i);
    await user.clear(burnField);
    await user.type(burnField, '25000');

    const runwayStatus = screen.getAllByRole('status')[1];
    expect(runwayStatus.textContent).toMatch(/Runway covers/);

    const budgetField = screen.getByLabelText(/portfolio budget/i);
    await user.clear(budgetField);
    await user.type(budgetField, '800000');

    const acquisitionStatus = screen.getAllByRole('status')[2];
    expect(acquisitionStatus.textContent).toMatch(/Remaining budget/);
  });
});
