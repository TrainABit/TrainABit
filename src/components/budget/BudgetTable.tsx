import { useState } from 'react';
import type { BudgetItem, PlanKey, BudgetCategory } from '../../types/budget';
import { BudgetItemModal } from './BudgetItemModal';
import { useBudgetStore } from '../../store/budgetStore';
import clsx from 'clsx';

interface BudgetTableProps {
  plan: PlanKey;
}

const planNames: Record<PlanKey, string> = {
  planA: 'Plan A: SBA 7(a) Acquisition',
  planB: 'Plan B: Runway & GTM',
  planC: 'Plan C: Micro-SaaS Roll-Up',
};

const categoryNames: Record<BudgetCategory, string> = {
  capex: 'Capital Expenditures',
  opex: 'Operating Expenses',
  financing: 'Financing',
};

export function BudgetTable({ plan }: BudgetTableProps) {
  const { budgetItems, updateBudgetItem, markAsPaid } = useBudgetStore();
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);

  const planItems = budgetItems.filter((item) => item.plan === plan);

  const itemsByCategory = planItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<BudgetCategory, BudgetItem[]>,
  );

  const totalAllocation = planItems.reduce((sum, item) => sum + item.allocation, 0);
  const totalSpent = planItems.reduce((sum, item) => sum + item.spent, 0);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const handleItemClick = (item: BudgetItem) => {
    setSelectedItem(item);
  };

  const handleSaveItem = (updates: Partial<BudgetItem>) => {
    if (selectedItem) {
      updateBudgetItem(selectedItem.id, updates);
    }
  };

  const handleMarkPaid = () => {
    if (selectedItem) {
      markAsPaid(selectedItem.id);
      setSelectedItem(null);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">{planNames[plan]}</h3>

      {(Object.keys(itemsByCategory) as BudgetCategory[]).map((category) => (
        <div key={category} className="mb-6">
          <h4 className="text-lg font-medium text-slate-300 mb-2">{categoryNames[category]}</h4>
          <div className="overflow-hidden rounded-lg border border-slate-700 bg-surface">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Allocation
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Spent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Remaining
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {itemsByCategory[category].map((item) => {
                  const remaining = item.allocation - item.spent;
                  const percentSpent = (item.spent / item.allocation) * 100;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="cursor-pointer hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-white">
                        <div>
                          {item.name}
                          {item.notes && (
                            <div className="text-xs text-slate-400 mt-1">{item.notes}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-100 text-right">
                        {formatCurrency(item.allocation)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-100 text-right">
                        {formatCurrency(item.spent)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-100 text-right">
                        {formatCurrency(remaining)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                            Paid
                          </span>
                        ) : percentSpent > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                            Partial
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex justify-end items-center gap-8 text-sm">
        <div className="text-slate-300">
          Total Allocated: <span className="font-semibold text-accent">{formatCurrency(totalAllocation)}</span>
        </div>
        <div className="text-slate-300">
          Total Spent: <span className="font-semibold text-warning">{formatCurrency(totalSpent)}</span>
        </div>
      </div>

      {selectedItem && (
        <BudgetItemModal
          item={selectedItem}
          onSave={handleSaveItem}
          onClose={() => setSelectedItem(null)}
          onMarkPaid={handleMarkPaid}
        />
      )}
    </div>
  );
}
