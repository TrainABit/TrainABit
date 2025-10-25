import { useState } from 'react';
import type { BudgetCategory, BudgetItem } from '../../types/budget';

interface BudgetItemModalProps {
  item: BudgetItem;
  onSave: (updates: Partial<BudgetItem>) => void;
  onClose: () => void;
  onMarkPaid: () => void;
}

const categoryOptions: { value: BudgetCategory; label: string }[] = [
  { value: 'capex', label: 'Capex' },
  { value: 'opex', label: 'Opex' },
  { value: 'financing', label: 'Financing' },
];

export function BudgetItemModal({ item, onSave, onClose, onMarkPaid }: BudgetItemModalProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<BudgetCategory>(item.category);
  const [allocation, setAllocation] = useState(item.allocation);
  const [spent, setSpent] = useState(item.spent);
  const [notes, setNotes] = useState(item.notes ?? '');

  const handleSave = () => {
    onSave({ name, category, allocation, spent, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl border border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit Budget Item</h3>
            <p className="text-sm text-slate-400">Update allocations and spend details for this line item.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-300">Name</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-300">Category</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                value={category}
                onChange={(event) => setCategory(event.target.value as BudgetCategory)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300">Allocation</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                value={allocation}
                onChange={(event) => setAllocation(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-300">Spent</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
                value={spent}
                onChange={(event) => setSpent(Number(event.target.value))}
              />
            </div>

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={onMarkPaid}
                className="rounded-md border border-success px-3 py-2 text-sm text-success hover:bg-success/10"
              >
                Mark as Paid
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300">Notes</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-accent focus:outline-none"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
