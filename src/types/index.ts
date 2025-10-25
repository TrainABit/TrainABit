export type PlanId = 'plan-a' | 'plan-b' | 'plan-c'

export type TabType = 'overview' | 'milestones' | 'tasks' | 'budget' | 'kpis' | 'risks' | 'notes' | 'resources'

export interface Milestone {
  id: string
  title: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'pending'
}

export interface Task {
  id: string
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  priority: 'high' | 'medium' | 'low'
}

export interface Plan {
  id: PlanId
  name: string
  description: string
  progress: number
  budgetTotal: number
  budgetSpent: number
  tasksTotal: number
  tasksCompleted: number
  nextMilestone?: Milestone
  milestones: Milestone[]
  tasks: Task[]
  kpis: {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'stable'
  }[]
}

export interface AppState {
  plans: Record<PlanId, Plan>
  selectedPlanId: PlanId
  activeTab: TabType
  sidebarOpen: boolean
  isLoading: boolean
  setSelectedPlan: (planId: PlanId) => void
  setActiveTab: (tab: TabType) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}
