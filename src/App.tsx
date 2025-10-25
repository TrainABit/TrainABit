import { BudgetDashboard } from './components/budget/BudgetDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-800 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Capital Strategy Workbench</h1>
            <p className="text-sm text-slate-400">
              Tailored budget oversight across acquisition, runway, and roll-up plans.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <BudgetDashboard />
      </main>
    </div>
  );
}
