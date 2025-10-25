import { create } from 'zustand'
import type { AppState, PlanId, TabType } from '../types'

const plans = {
  'plan-a': {
    id: 'plan-a',
    name: 'Plan A',
    description: 'Launch the MVP with core collaboration features and onboarding flow.',
    progress: 64,
    budgetTotal: 120000,
    budgetSpent: 78000,
    tasksTotal: 48,
    tasksCompleted: 31,
    nextMilestone: {
      id: 'ms-1',
      title: 'Beta launch',
      dueDate: '2024-11-15',
      status: 'in-progress',
    },
    milestones: [
      { id: 'plan-a-ms-1', title: 'Discovery complete', dueDate: '2024-08-01', status: 'completed' },
      { id: 'plan-a-ms-2', title: 'Design sign-off', dueDate: '2024-09-10', status: 'completed' },
      { id: 'plan-a-ms-3', title: 'MVP beta', dueDate: '2024-11-15', status: 'in-progress' },
      { id: 'plan-a-ms-4', title: 'Public launch', dueDate: '2025-01-30', status: 'pending' },
    ],
    tasks: [
      { id: 'plan-a-task-1', title: 'Finalize onboarding flow', status: 'completed', priority: 'high' },
      { id: 'plan-a-task-2', title: 'Implement analytics tracking', status: 'in-progress', priority: 'medium' },
      { id: 'plan-a-task-3', title: 'QA regression suite', status: 'pending', priority: 'low' },
    ],
    kpis: [
      { label: 'Activation Rate', value: '42%', trend: 'up' },
      { label: 'Weekly Active Users', value: 640, trend: 'up' },
      { label: 'NPS', value: 36, trend: 'stable' },
    ],
  },
  'plan-b': {
    id: 'plan-b',
    name: 'Plan B',
    description: 'Improve retention by rolling out personalized assistant workflows.',
    progress: 38,
    budgetTotal: 95000,
    budgetSpent: 32000,
    tasksTotal: 60,
    tasksCompleted: 22,
    nextMilestone: {
      id: 'ms-2',
      title: 'Assistant recommendation engine',
      dueDate: '2025-01-10',
      status: 'in-progress',
    },
    milestones: [
      { id: 'plan-b-ms-1', title: 'Data instrumentation', dueDate: '2024-10-05', status: 'completed' },
      { id: 'plan-b-ms-2', title: 'Assistant v1 prototype', dueDate: '2024-12-01', status: 'in-progress' },
      { id: 'plan-b-ms-3', title: 'Retention experiment', dueDate: '2025-03-12', status: 'pending' },
    ],
    tasks: [
      { id: 'plan-b-task-1', title: 'Define personalization segments', status: 'completed', priority: 'high' },
      { id: 'plan-b-task-2', title: 'Assistant flow storyboards', status: 'in-progress', priority: 'high' },
      { id: 'plan-b-task-3', title: 'Experiment framework updates', status: 'pending', priority: 'medium' },
    ],
    kpis: [
      { label: 'Day-30 Retention', value: '27%', trend: 'up' },
      { label: 'Assistant Engagement', value: '14 mins', trend: 'up' },
      { label: 'Feature Adoption', value: '61%', trend: 'stable' },
    ],
  },
  'plan-c': {
    id: 'plan-c',
    name: 'Plan C',
    description: 'Scale infrastructure and improve performance for enterprise clients.',
    progress: 22,
    budgetTotal: 150000,
    budgetSpent: 24000,
    tasksTotal: 34,
    tasksCompleted: 11,
    nextMilestone: {
      id: 'ms-3',
      title: 'SLA compliance baseline',
      dueDate: '2025-02-20',
      status: 'pending',
    },
    milestones: [
      { id: 'plan-c-ms-1', title: 'Infrastructure audit', dueDate: '2024-10-30', status: 'in-progress' },
      { id: 'plan-c-ms-2', title: 'Performance benchmarking', dueDate: '2025-01-05', status: 'pending' },
    ],
    tasks: [
      { id: 'plan-c-task-1', title: 'Upgrade monitoring stack', status: 'in-progress', priority: 'high' },
      { id: 'plan-c-task-2', title: 'Cache invalidation strategy', status: 'pending', priority: 'high' },
    ],
    kpis: [
      { label: 'Avg Response Time', value: '420ms', trend: 'down' },
      { label: 'Error Rate', value: '0.7%', trend: 'down' },
      { label: 'Uptime', value: '99.3%', trend: 'stable' },
    ],
  },
} satisfies Record<PlanId, AppState['plans'][PlanId]>

export const usePlanStore = create<AppState>((set) => ({
  plans,
  selectedPlanId: 'plan-a',
  activeTab: 'overview',
  sidebarOpen: false,
  isLoading: false,
  setSelectedPlan: (planId: PlanId) =>
    set((state) => ({
      selectedPlanId: planId,
      activeTab: state.activeTab,
    })),
  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
