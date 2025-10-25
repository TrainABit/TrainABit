import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BudgetItem,
  PlanAInputs,
  PlanBInputs,
  PlanCInputs,
  AcquisitionInput,
  PlanALinkedBudgetItems,
} from '../types/budget';

const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const clampSpent = (spent: number, allocation: number) => Math.min(Math.max(spent, 0), allocation);

const applyPlanALinks = (
  items: BudgetItem[],
  inputs: PlanAInputs,
  links: PlanALinkedBudgetItems,
): BudgetItem[] => {
  const equityAllocation = Math.max(
    inputs.purchasePrice * (inputs.equityInjectionPercent / 100),
    0,
  );
  const workingCapitalAllocation = Math.max(inputs.workingCapital, 0);
  const qoeAllocation = Math.max(inputs.qoeLegal, 0);
  const marketingAllocation = Math.max(inputs.marketingBudget, 0);

  return items.map((item) => {
    if (item.id === links.equityInjectionItemId) {
      const allocation = equityAllocation;
      return {
        ...item,
        allocation,
        spent: clampSpent(item.spent, allocation),
      };
    }

    if (item.id === links.workingCapitalItemId) {
      const allocation = workingCapitalAllocation;
      return {
        ...item,
        allocation,
        spent: clampSpent(item.spent, allocation),
      };
    }

    if (item.id === links.qoeItemId) {
      const allocation = qoeAllocation;
      return {
        ...item,
        allocation,
        spent: clampSpent(item.spent, allocation),
      };
    }

    if (item.id === links.marketingItemId) {
      const allocation = marketingAllocation;
      return {
        ...item,
        allocation,
        spent: clampSpent(item.spent, allocation),
      };
    }

    return item;
  });
};

interface BudgetState {
  startingCapital: number;
  budgetItems: BudgetItem[];
  planAInputs: PlanAInputs;
  planALinks: PlanALinkedBudgetItems;
  planBInputs: PlanBInputs;
  planCInputs: PlanCInputs;

  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  markAsPaid: (id: string) => void;
  updateSpent: (id: string, spent: number) => void;

  setPlanAInputs: (inputs: Partial<PlanAInputs>) => void;
  setPlanALinks: (links: Partial<PlanALinkedBudgetItems>) => void;
  setPlanBInputs: (inputs: Partial<PlanBInputs>) => void;
  setPlanCInputs: (inputs: Partial<PlanCInputs>) => void;
  addAcquisition: (acq: Omit<AcquisitionInput, 'id'>) => void;
  updateAcquisition: (id: string, updates: Partial<AcquisitionInput>) => void;
  deleteAcquisition: (id: string) => void;
}

const seedBudgetItems: BudgetItem[] = [
  {
    id: 'pa-equity',
    plan: 'planA',
    category: 'capex',
    name: 'Equity Injection',
    allocation: 75000,
    spent: 0,
    notes: 'Initial equity for SBA 7(a) acquisition',
  },
  {
    id: 'pa-working',
    plan: 'planA',
    category: 'capex',
    name: 'Working Capital',
    allocation: 20000,
    spent: 0,
    notes: 'Post-acquisition working capital reserve',
  },
  {
    id: 'pa-qoe',
    plan: 'planA',
    category: 'opex',
    name: 'QoE & Legal',
    allocation: 15000,
    spent: 0,
    notes: 'Quality of Earnings report and legal fees',
  },
  {
    id: 'pa-marketing',
    plan: 'planA',
    category: 'opex',
    name: 'Marketing Budget',
    allocation: 10000,
    spent: 0,
    notes: 'Initial marketing campaign budget',
  },
  {
    id: 'pb-team',
    plan: 'planB',
    category: 'opex',
    name: 'Team Salaries',
    allocation: 100000,
    spent: 0,
    notes: 'Monthly team burn allocated for 10 months',
  },
  {
    id: 'pb-gtm',
    plan: 'planB',
    category: 'opex',
    name: 'GTM & Sales',
    allocation: 50000,
    spent: 0,
    notes: 'Go-to-market and sales acquisition costs',
  },
  {
    id: 'pb-compliance',
    plan: 'planB',
    category: 'opex',
    name: 'Compliance',
    allocation: 15000,
    spent: 0,
    notes: 'SOC 2, security audits, legal compliance',
  },
  {
    id: 'pb-infra',
    plan: 'planB',
    category: 'opex',
    name: 'Infrastructure',
    allocation: 10000,
    spent: 0,
    notes: 'Cloud hosting, tools, and infrastructure',
  },
  {
    id: 'pc-acq1',
    plan: 'planC',
    category: 'capex',
    name: 'Acquisition Fund 1',
    allocation: 80000,
    spent: 0,
    notes: 'First micro-SaaS acquisition',
  },
  {
    id: 'pc-acq2',
    plan: 'planC',
    category: 'capex',
    name: 'Acquisition Fund 2',
    allocation: 70000,
    spent: 0,
    notes: 'Second micro-SaaS acquisition',
  },
  {
    id: 'pc-integration',
    plan: 'planC',
    category: 'opex',
    name: 'Integration Costs',
    allocation: 25000,
    spent: 0,
    notes: 'Post-acquisition integration and optimization',
  },
];

const defaultPlanAInputs: PlanAInputs = {
  purchasePrice: 500000,
  equityInjectionPercent: 15,
  interestRate: 7.5,
  amortizationYears: 10,
  projectedEBITDA: 120000,
  workingCapital: 20000,
  qoeLegal: 15000,
  marketingBudget: 10000,
};

const defaultPlanBInputs: PlanBInputs = {
  burnTeam: 10000,
  burnGTM: 5000,
  burnCompliance: 1500,
  burnInfra: 1000,
  currentArr: 60000,
  marginAssumption: 70,
  cac: 500,
  paybackPeriodMonths: 6,
};

const defaultPlanCInputs: PlanCInputs = {
  acquisitions: [
    {
      id: 'acq-1',
      name: 'SaaS Product A',
      arr: 50000,
      purchaseMultiple: 3,
      cashDown: 50,
      sellerNotePercent: 30,
      earnoutPercent: 20,
    },
    {
      id: 'acq-2',
      name: 'SaaS Product B',
      arr: 40000,
      purchaseMultiple: 2.5,
      cashDown: 60,
      sellerNotePercent: 25,
      earnoutPercent: 15,
    },
  ],
  postIntegrationMarginPercent: 65,
};

const defaultPlanALinks: PlanALinkedBudgetItems = {
  equityInjectionItemId: 'pa-equity',
  workingCapitalItemId: 'pa-working',
  qoeItemId: 'pa-qoe',
  marketingItemId: 'pa-marketing',
};

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      startingCapital: 500000,
      budgetItems: seedBudgetItems,
      planAInputs: defaultPlanAInputs,
      planALinks: defaultPlanALinks,
      planBInputs: defaultPlanBInputs,
      planCInputs: defaultPlanCInputs,

      addBudgetItem: (item) => {
        set((state) => ({
          budgetItems: [
            ...state.budgetItems,
            { ...item, id: generateId('item') },
          ],
        }));
      },

      updateBudgetItem: (id, updates) => {
        set((state) => ({
          budgetItems: state.budgetItems.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const allocation = updates.allocation ?? item.allocation;
            const spent = updates.spent ?? item.spent;

            return {
              ...item,
              ...updates,
              allocation,
              spent: clampSpent(spent, allocation),
            };
          }),
        }));
      },

      deleteBudgetItem: (id) => {
        set((state) => ({
          budgetItems: state.budgetItems.filter((item) => item.id !== id),
        }));
      },

      markAsPaid: (id) => {
        set((state) => ({
          budgetItems: state.budgetItems.map((item) =>
            item.id === id
              ? { ...item, isPaid: true, spent: item.allocation }
              : item,
          ),
        }));
      },

      updateSpent: (id, spent) => {
        set((state) => ({
          budgetItems: state.budgetItems.map((item) =>
            item.id === id
              ? { ...item, spent: clampSpent(spent, item.allocation) }
              : item,
          ),
        }));
      },

      setPlanAInputs: (inputs) => {
        set((state) => {
          const nextInputs = { ...state.planAInputs, ...inputs };
          const budgetItems = applyPlanALinks(
            state.budgetItems,
            nextInputs,
            state.planALinks,
          );

          return {
            planAInputs: nextInputs,
            budgetItems,
          };
        });
      },

      setPlanALinks: (links) => {
        set((state) => {
          const nextLinks = { ...state.planALinks, ...links };
          const budgetItems = applyPlanALinks(
            state.budgetItems,
            state.planAInputs,
            nextLinks,
          );

          return {
            planALinks: nextLinks,
            budgetItems,
          };
        });
      },

      setPlanBInputs: (inputs) => {
        set((state) => ({
          planBInputs: { ...state.planBInputs, ...inputs },
        }));
      },

      setPlanCInputs: (inputs) => {
        set((state) => ({
          planCInputs: { ...state.planCInputs, ...inputs },
        }));
      },

      addAcquisition: (acq) => {
        set((state) => ({
          planCInputs: {
            ...state.planCInputs,
            acquisitions: [
              ...state.planCInputs.acquisitions,
              { ...acq, id: generateId('acq') },
            ],
          },
        }));
      },

      updateAcquisition: (id, updates) => {
        set((state) => ({
          planCInputs: {
            ...state.planCInputs,
            acquisitions: state.planCInputs.acquisitions.map((acq) =>
              acq.id === id ? { ...acq, ...updates } : acq,
            ),
          },
        }));
      },

      deleteAcquisition: (id) => {
        set((state) => ({
          planCInputs: {
            ...state.planCInputs,
            acquisitions: state.planCInputs.acquisitions.filter(
              (acq) => acq.id !== id,
            ),
          },
        }));
      },
    }),
    {
      name: 'budget-store',
    },
  ),
);
