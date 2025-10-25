import { useBudgetStore } from '../../store/budgetStore';
import { calculatePlanC } from '../../lib/budgetCalculators';

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function PlanCCalculator() {
  const {
    planCInputs,
    setPlanCInputs,
    updateAcquisition,
    addAcquisition,
    deleteAcquisition,
  } = useBudgetStore();

  const results = calculatePlanC(planCInputs);

  const handleMarginChange = (value: number) => {
    setPlanCInputs({ postIntegrationMarginPercent: value });
  };

  const handleAcquisitionChange = (id: string, field: keyof (typeof planCInputs)['acquisitions'][number], value: number | string) => {
    updateAcquisition(id, { [field]: value } as never);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Micro-SaaS Roll-up Calculator</h4>
        <p className="text-sm text-slate-400 mb-6">
          Model a consolidated roll-up of micro-SaaS acquisitions, track cash deployed, and estimate post-integration profitability.
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-md font-semibold text-white">Acquisitions</h5>
          <button
            type="button"
            onClick={() =>
              addAcquisition({
                name: 'New Acquisition',
                arr: 25000,
                purchaseMultiple: 3,
                cashDown: 50,
                sellerNotePercent: 25,
                earnoutPercent: 25,
              })
            }
            className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-300"
          >
            Add Acquisition
          </button>
        </div>

        <div className="space-y-4">
          {planCInputs.acquisitions.map((acq) => (
            <div key={acq.id} className="rounded-md border border-slate-700 bg-slate-900/60 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Name</label>
                  <input
                    value={acq.name}
                    onChange={(e) => handleAcquisitionChange(acq.id, 'name', e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => deleteAcquisition(acq.id)}
                  className="self-start rounded-md border border-danger px-3 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">ARR</label>
                  <input
                    type="number"
                    min={0}
                    value={acq.arr}
                    onChange={(e) => handleAcquisitionChange(acq.id, 'arr', Number(e.target.value))}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Purchase Multiple</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={acq.purchaseMultiple}
                    onChange={(e) => handleAcquisitionChange(acq.id, 'purchaseMultiple', Number(e.target.value))}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Cash Down (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={acq.cashDown}
                    onChange={(e) => handleAcquisitionChange(acq.id, 'cashDown', Number(e.target.value))}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Seller Note (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={acq.sellerNotePercent}
                    onChange={(e) => handleAcquisitionChange(acq.id, 'sellerNotePercent', Number(e.target.value))}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Earnout (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={acq.earnoutPercent}
                    onChange={(e) => handleAcquisitionChange(acq.id, 'earnoutPercent', Number(e.target.value))}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">Post-Integration Assumptions</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Projected SDE Margin (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={planCInputs.postIntegrationMarginPercent}
              onChange={(e) => handleMarginChange(Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-surface p-6">
        <h5 className="text-md font-semibold text-white mb-4">Roll-up Summary</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-slate-400 text-sm mb-1">Consolidated ARR</div>
            <div className="text-xl font-semibold text-accent">{formatCurrency(results.totalARR)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Weighted Multiple</div>
            <div className="text-xl font-semibold text-white">{results.weightedMultiple.toFixed(2)}x</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Total Purchase Price</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(results.totalPurchasePrice)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Cash Deployed</div>
            <div className="text-xl font-semibold text-warning">{formatCurrency(results.totalCashDown)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Seller Notes</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(results.totalSellerNotes)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Earnouts</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(results.totalEarnouts)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Projected SDE</div>
            <div className="text-xl font-semibold text-success">{formatCurrency(results.projectedSDE)}</div>
          </div>
          <div className="text-sm text-slate-400">
            Cash deployed represents the upfront capital required across all targets. Seller notes and earnouts defer payouts, preserving cash.
          </div>
        </div>
      </div>
    </div>
  );
}
