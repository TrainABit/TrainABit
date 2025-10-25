import { useState } from 'react';
import { BudgetSummary } from './BudgetSummary';
import { BudgetTable } from './BudgetTable';
import { PlanACalculator } from './PlanACalculator';
import { PlanBCalculator } from './PlanBCalculator';
import { PlanCCalculator } from './PlanCCalculator';
import { QuickStatsSidebar } from './QuickStatsSidebar';
import type { PlanKey } from '../../types/budget';

type TabKey = 'overview' | 'planA' | 'planB' | 'planC';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Budget Overview' },
  { key: 'planA', label: 'Plan A: SBA 7(a)' },
  { key: 'planB', label: 'Plan B: Runway' },
  { key: 'planC', label: 'Plan C: Roll-Up' },
];

export function BudgetDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <main className="flex-1">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Budget & Calculators</h2>
          <p className="text-slate-400">
            Manage your $500k capital allocations across three strategic plans and track key financial metrics.
          </p>
        </div>

        <div className="mb-6">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'border-accent text-accent'
                      : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div>
            <BudgetSummary />
            <BudgetTable plan="planA" />
            <BudgetTable plan="planB" />
            <BudgetTable plan="planC" />
          </div>
        )}

        {activeTab === 'planA' && <PlanACalculator />}
        {activeTab === 'planB' && <PlanBCalculator />}
        {activeTab === 'planC' && <PlanCCalculator />}
      </main>

      <aside className="lg:w-80">
        <QuickStatsSidebar />
      </aside>
    </div>
  );
}
