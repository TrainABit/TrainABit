import { useBudgetStore } from '../../store/budgetStore';
import { calculatePlanA } from '../../lib/budgetCalculators';

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function PlanACalculator() {
  const { planAInputs, planALinks, budgetItems, setPlanAInputs, setPlanALinks } = useBudgetStore();
  const results = calculatePlanA(planAInputs);

  const handleInputChange = (field: keyof typeof planAInputs, value: number) => {
    setPlanAInputs({ [field]: value });
  };

  const handleLinkChange = (
    field: keyof typeof planALinks,
    value: string,
  ) => {
    setPlanALinks({ [field]: value });
  };

  const planItems = budgetItems.filter((item) => item.plan === 'planA');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">SBA 7(a) Acquisition Calculator</h4>
        <p className="text-sm text-slate-400 mb-6">
          Configure the SBA 7(a) loan structure and projected financial metrics. The DSCR (Debt Service Coverage Ratio) should typically exceed 1.25 for approval.
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">Inputs</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Purchase Price</label>
            <input
              type="number"
              min={0}
              value={planAInputs.purchasePrice}
              onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Equity Injection (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={planAInputs.equityInjectionPercent}
              onChange={(e) => handleInputChange('equityInjectionPercent', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={planAInputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Amortization (Years)</label>
            <input
              type="number"
              min={1}
              value={planAInputs.amortizationYears}
              onChange={(e) => handleInputChange('amortizationYears', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Projected EBITDA</label>
            <input
              type="number"
              min={0}
              value={planAInputs.projectedEBITDA}
              onChange={(e) => handleInputChange('projectedEBITDA', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Working Capital</label>
            <input
              type="number"
              min={0}
              value={planAInputs.workingCapital}
              onChange={(e) => handleInputChange('workingCapital', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">QoE & Legal</label>
            <input
              type="number"
              min={0}
              value={planAInputs.qoeLegal}
              onChange={(e) => handleInputChange('qoeLegal', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Marketing Budget</label>
            <input
              type="number"
              min={0}
              value={planAInputs.marketingBudget}
              onChange={(e) => handleInputChange('marketingBudget', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 rounded-md border border-slate-700 bg-slate-900/60 p-4">
          <h6 className="text-sm font-semibold text-slate-200 mb-3">Link to Budget Items</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Equity Injection Item</label>
              <select
                value={planALinks.equityInjectionItemId ?? ''}
                onChange={(e) => handleLinkChange('equityInjectionItemId', e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
              >
                {planItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Working Capital Item</label>
              <select
                value={planALinks.workingCapitalItemId ?? ''}
                onChange={(e) => handleLinkChange('workingCapitalItemId', e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
              >
                {planItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">QoE & Legal Item</label>
              <select
                value={planALinks.qoeItemId ?? ''}
                onChange={(e) => handleLinkChange('qoeItemId', e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
              >
                {planItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Marketing Item</label>
              <select
                value={planALinks.marketingItemId ?? ''}
                onChange={(e) => handleLinkChange('marketingItemId', e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
              >
                {planItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Linked items automatically update their allocations based on calculator assumptions to keep the $500k capital plan in sync.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">Key Metrics</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-slate-400 text-sm mb-1">Loan Amount</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(results.loanAmount)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Equity Injection</div>
            <div className="text-xl font-semibold text-accent">{formatCurrency(results.equityInjectionAmount)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Monthly Debt Service</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(results.monthlyDebtService)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Annual Debt Service</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(results.annualDebtService)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">DSCR</div>
            <div className={`text-xl font-semibold ${results.dscr >= 1.25 ? 'text-success' : 'text-warning'}`}>
              {results.dscr.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {results.dscr >= 1.25 ? '✓ Meets SBA requirement' : '⚠ Below 1.25 threshold'}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Cash-on-Cash Return</div>
            <div className="text-xl font-semibold text-white">{formatPercent(results.cashOnCash)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">24-Month Debt Paydown Schedule</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-400">Month</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-400">Payment</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-400">Interest</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-400">Principal</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-400">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {results.schedule.map((entry) => (
                <tr key={entry.month} className="hover:bg-slate-700/30">
                  <td className="px-4 py-2 text-slate-100">{entry.month}</td>
                  <td className="px-4 py-2 text-right text-slate-100">{formatCurrency(entry.payment)}</td>
                  <td className="px-4 py-2 text-right text-warning">{formatCurrency(entry.interest)}</td>
                  <td className="px-4 py-2 text-right text-success">{formatCurrency(entry.principal)}</td>
                  <td className="px-4 py-2 text-right text-slate-100">{formatCurrency(entry.balance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800">
              <tr>
                <td className="px-4 py-3 text-left font-semibold text-slate-200">Totals (24mo)</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-100">
                  {formatCurrency(results.totalInterest24Months + results.totalPrincipal24Months)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-warning">
                  {formatCurrency(results.totalInterest24Months)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-success">
                  {formatCurrency(results.totalPrincipal24Months)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-100">
                  {formatCurrency(results.remainingBalanceAfter24Months)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
