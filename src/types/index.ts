export type PlanId = 'plan-a' | 'plan-b' | 'plan-c'

export type TabType = 'overview' | 'milestones' | 'tasks' | 'budget' | 'kpis' | 'risks' | 'notes' | 'resources'

export type TaskStatus = 'backlog' | 'in-progress' | 'blocked' | 'done'

export type MilestoneStatus = 'not-started' | 'tracking' | 'at-risk' | 'complete'

export interface Milestone {
  id: string
  title: string
  targetDate: string
  status: MilestoneStatus
  notes?: string
  taskIds: string[]
  completionThreshold?: number
  manualProgress?: number
  statusOverride?: MilestoneStatus
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string
  assignee?: string
  percentComplete: number
  milestoneId?: string
  priority?: 'high' | 'medium' | 'low'
  order: number
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: PlanId
  name: string
  description: string
  progress: number
  budgetTotal: number
  budgetSpent: number
  tasks: Task[]
  milestones: Milestone[]
  kpis: {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'stable'
  }[]
}

export interface PlanProgressSummary {
  totalTasks: number
  completedTasks: number
  tasksByStatus: Record<TaskStatus, Task[]>
  milestonesByStatus: Record<MilestoneStatus, Milestone[]>
  nextMilestone?: Milestone
  milestoneProgress: number
  taskProgress: number
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
  createTask: (
    planId: PlanId,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> & { order?: number }
  ) => void
  updateTask: (planId: PlanId, taskId: string, updates: Partial<Task>) => void
  deleteTask: (planId: PlanId, taskId: string) => void
  moveTask: (
    planId: PlanId,
    taskId: string,
    status: TaskStatus,
    targetIndex: number
  ) => void
  createMilestone: (planId: PlanId, milestone: Omit<Milestone, 'id'>) => void
  updateMilestone: (planId: PlanId, milestoneId: string, updates: Partial<Milestone>) => void
  deleteMilestone: (planId: PlanId, milestoneId: string) => void
  linkTaskToMilestone: (planId: PlanId, taskId: string, milestoneId?: string) => void
  getPlanProgressSummary: (planId: PlanId) => PlanProgressSummary | undefined
  recalcPlanProgress: (planId: PlanId) => void
  recalcAllPlans: () => void
}
