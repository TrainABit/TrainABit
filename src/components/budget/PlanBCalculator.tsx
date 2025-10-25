import { useBudgetStore } from '../../store/budgetStore';
import { calculatePlanB } from '../../lib/budgetCalculators';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export function PlanBCalculator() {
  const { planBInputs, setPlanBInputs, budgetItems } = useBudgetStore();

  const planBAllocated = budgetItems
    .filter((item) => item.plan === 'planB')
    .reduce((sum, item) => sum + (item.allocation - item.spent), 0);

  const results = calculatePlanB(planBInputs, Math.max(planBAllocated, 0));

  const handleInputChange = (field: keyof typeof planBInputs, value: number) => {
    setPlanBInputs({ [field]: value });
  };

  const chartData = results.arrSeries.slice(0, 24);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Runway & GTM Calculator</h4>
        <p className="text-sm text-slate-400 mb-6">
          Model your monthly burn, ARR growth trajectory, and runway to profitability. Track when recurring margins will meet or exceed expenses.
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">Inputs</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Team Burn (Monthly)</label>
            <input
              type="number"
              min={0}
              value={planBInputs.burnTeam}
              onChange={(e) => handleInputChange('burnTeam', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">GTM & Sales (Monthly)</label>
            <input
              type="number"
              min={0}
              value={planBInputs.burnGTM}
              onChange={(e) => handleInputChange('burnGTM', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Compliance (Monthly)</label>
            <input
              type="number"
              min={0}
              value={planBInputs.burnCompliance}
              onChange={(e) => handleInputChange('burnCompliance', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Infrastructure (Monthly)</label>
            <input
              type="number"
              min={0}
              value={planBInputs.burnInfra}
              onChange={(e) => handleInputChange('burnInfra', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Current ARR</label>
            <input
              type="number"
              min={0}
              value={planBInputs.currentArr}
              onChange={(e) => handleInputChange('currentArr', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Margin Assumption (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={planBInputs.marginAssumption}
              onChange={(e) => handleInputChange('marginAssumption', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">CAC (Customer Acquisition Cost)</label>
            <input
              type="number"
              min={0}
              value={planBInputs.cac}
              onChange={(e) => handleInputChange('cac', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Payback Period (Months)</label>
            <input
              type="number"
              min={0}
              value={planBInputs.paybackPeriodMonths}
              onChange={(e) => handleInputChange('paybackPeriodMonths', Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">Key Metrics</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-slate-400 text-sm mb-1">Total Monthly Burn</div>
            <div className="text-xl font-semibold text-warning">{formatCurrency(results.totalBurn)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Runway (Months)</div>
            <div className="text-xl font-semibold text-white">
              {results.runwayMonths === Infinity ? '∞' : results.runwayMonths.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Margin Breakeven</div>
            <div className="text-xl font-semibold text-success">
              {results.marginAchievedInMonth
                ? `Month ${results.marginAchievedInMonth}`
                : 'Not within runway'}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">ARR Growth Projection (24 Months)</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Month ${label}`}
            />
            <Line type="monotone" dataKey="arr" stroke="#38bdf8" strokeWidth={2} dot={false} name="ARR" />
            <Line type="monotone" dataKey="margin" stroke="#34d399" strokeWidth={2} dot={false} name="Monthly Margin" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">ARR Milestones</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-400">Month</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-400">ARR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {results.arrMilestones.map((milestone) => (
                <tr key={milestone.month} className="hover:bg-slate-700/30">
                  <td className="px-4 py-2 text-slate-100">{milestone.month === 0 ? 'Current' : `Month ${milestone.month}`}</td>
                  <td className="px-4 py-2 text-right text-accent font-semibold">{formatCurrency(milestone.arr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
