import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AppState,
  Plan,
  PlanId,
  PlanProgressSummary,
  TabType,
  Task,
  TaskStatus,
  Milestone,
  MilestoneStatus,
} from '../types'

const now = new Date().toISOString()

const TASK_STATUS_ORDER: TaskStatus[] = ['backlog', 'in-progress', 'blocked', 'done']

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const initialPlans: Record<PlanId, Plan> = {
  'plan-a': {
    id: 'plan-a',
    name: 'Plan A',
    description: 'Launch the MVP with core collaboration features and onboarding flow.',
    progress: 64,
    budgetTotal: 120000,
    budgetSpent: 78000,
    milestones: [
      {
        id: 'plan-a-ms-1',
        title: 'Discovery complete',
        targetDate: '2024-08-01',
        status: 'complete',
        taskIds: [],
      },
      {
        id: 'plan-a-ms-2',
        title: 'Design sign-off',
        targetDate: '2024-09-10',
        status: 'complete',
        taskIds: [],
      },
      {
        id: 'plan-a-ms-3',
        title: 'MVP beta',
        targetDate: '2024-11-15',
        status: 'tracking',
        taskIds: ['plan-a-task-1', 'plan-a-task-2'],
        completionThreshold: 80,
      },
      {
        id: 'plan-a-ms-4',
        title: 'Public launch',
        targetDate: '2025-01-30',
        status: 'not-started',
        taskIds: ['plan-a-task-3'],
        completionThreshold: 100,
      },
    ],
    tasks: [
      {
        id: 'plan-a-task-1',
        title: 'Finalize onboarding flow',
        description: 'Complete the user onboarding experience with guided tour.',
        status: 'done',
        priority: 'high',
        percentComplete: 100,
        milestoneId: 'plan-a-ms-3',
        assignee: 'Sarah Chen',
        dueDate: '2024-11-01',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'plan-a-task-2',
        title: 'Implement analytics tracking',
        description: 'Set up event tracking and user behavior analytics.',
        status: 'in-progress',
        priority: 'medium',
        percentComplete: 65,
        milestoneId: 'plan-a-ms-3',
        assignee: 'Mike Johnson',
        dueDate: '2024-11-10',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'plan-a-task-3',
        title: 'QA regression suite',
        description: 'Build comprehensive automated test coverage.',
        status: 'backlog',
        priority: 'low',
        percentComplete: 0,
        milestoneId: 'plan-a-ms-4',
        assignee: 'Alex Kim',
        dueDate: '2025-01-15',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
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
    milestones: [
      {
        id: 'plan-b-ms-1',
        title: 'Data instrumentation',
        targetDate: '2024-10-05',
        status: 'complete',
        taskIds: ['plan-b-task-1'],
      },
      {
        id: 'plan-b-ms-2',
        title: 'Assistant v1 prototype',
        targetDate: '2024-12-01',
        status: 'tracking',
        taskIds: ['plan-b-task-2'],
        completionThreshold: 80,
      },
      {
        id: 'plan-b-ms-3',
        title: 'Retention experiment',
        targetDate: '2025-03-12',
        status: 'not-started',
        taskIds: ['plan-b-task-3'],
        completionThreshold: 100,
      },
    ],
    tasks: [
      {
        id: 'plan-b-task-1',
        title: 'Define personalization segments',
        description: 'Create user personas and segmentation strategy.',
        status: 'done',
        priority: 'high',
        percentComplete: 100,
        milestoneId: 'plan-b-ms-1',
        assignee: 'Emma Davis',
        dueDate: '2024-10-01',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'plan-b-task-2',
        title: 'Assistant flow storyboards',
        description: 'Design and prototype assistant interaction flows.',
        status: 'in-progress',
        priority: 'high',
        percentComplete: 55,
        milestoneId: 'plan-b-ms-2',
        assignee: 'Chris Wong',
        dueDate: '2024-11-20',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'plan-b-task-3',
        title: 'Experiment framework updates',
        description: 'Enhance A/B testing infrastructure.',
        status: 'backlog',
        priority: 'medium',
        percentComplete: 0,
        milestoneId: 'plan-b-ms-3',
        assignee: 'Jordan Lee',
        dueDate: '2025-02-28',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
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
    milestones: [
      {
        id: 'plan-c-ms-1',
        title: 'Infrastructure audit',
        targetDate: '2024-10-30',
        status: 'tracking',
        taskIds: ['plan-c-task-1'],
        completionThreshold: 90,
      },
      {
        id: 'plan-c-ms-2',
        title: 'Performance benchmarking',
        targetDate: '2025-01-05',
        status: 'not-started',
        taskIds: ['plan-c-task-2'],
        completionThreshold: 100,
      },
    ],
    tasks: [
      {
        id: 'plan-c-task-1',
        title: 'Upgrade monitoring stack',
        description: 'Implement comprehensive observability platform.',
        status: 'in-progress',
        priority: 'high',
        percentComplete: 40,
        milestoneId: 'plan-c-ms-1',
        assignee: 'Taylor Brown',
        dueDate: '2024-10-25',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'plan-c-task-2',
        title: 'Cache invalidation strategy',
        description: 'Design and implement distributed caching layer.',
        status: 'backlog',
        priority: 'high',
        percentComplete: 0,
        milestoneId: 'plan-c-ms-2',
        assignee: 'Morgan White',
        dueDate: '2024-12-20',
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
    kpis: [
      { label: 'Avg Response Time', value: '420ms', trend: 'down' },
      { label: 'Error Rate', value: '0.7%', trend: 'down' },
      { label: 'Uptime', value: '99.3%', trend: 'stable' },
    ],
  },
}

const groupTasksByStatus = (tasks: Task[]): Record<TaskStatus, Task[]> => {
  const grouped: Record<TaskStatus, Task[]> = {
    backlog: [],
    'in-progress': [],
    blocked: [],
    done: [],
  }

  tasks.forEach((task) => {
    grouped[task.status].push({ ...task })
  })

  return grouped
}

const sortAndReindexTasks = (tasks: Task[]): Task[] => {
  const grouped = groupTasksByStatus(tasks)
  const ordered: Task[] = []

  TASK_STATUS_ORDER.forEach((status) => {
    grouped[status]
      .sort((a, b) => a.order - b.order)
      .forEach((task, index) => {
        ordered.push({ ...task, order: index })
      })
  })

  return ordered
}

const syncMilestoneTaskLinks = (
  milestones: Milestone[],
  taskId: string,
  nextMilestoneId?: string
): Milestone[] =>
  milestones.map((milestone) => {
    const filtered = milestone.taskIds.filter((id) => id !== taskId)
    if (nextMilestoneId && milestone.id === nextMilestoneId) {
      return {
        ...milestone,
        taskIds: filtered.includes(taskId) ? filtered : [...filtered, taskId],
      }
    }
    return { ...milestone, taskIds: filtered }
  })

const getMilestoneProgress = (milestone: Milestone, tasks: Task[]): number => {
  if (milestone.manualProgress !== undefined) {
    return clamp(milestone.manualProgress, 0, 100)
  }

  const linked = tasks.filter((task) => milestone.taskIds.includes(task.id))
  if (!linked.length) {
    return 0
  }

  const total = linked.reduce((sum, task) => sum + task.percentComplete, 0)
  return clamp(total / linked.length, 0, 100)
}

const calculateMilestoneStatus = (milestone: Milestone, tasks: Task[]): MilestoneStatus => {
  if (milestone.statusOverride) {
    return milestone.statusOverride
  }

  const progress = getMilestoneProgress(milestone, tasks)
  const threshold = milestone.completionThreshold ?? 100
  const isOverdue = new Date(milestone.targetDate) < new Date()

  if (progress >= threshold) {
    return 'complete'
  }

  if (progress === 0 && !isOverdue) {
    return 'not-started'
  }

  if (isOverdue && progress < threshold) {
    return 'at-risk'
  }

  return 'tracking'
}

const calculatePlanProgress = (tasks: Task[], milestones: Milestone[]): number => {
  const taskAverage = tasks.length
    ? tasks.reduce((sum, task) => sum + task.percentComplete, 0) / tasks.length
    : 0

  const milestoneAverage = milestones.length
    ? milestones.reduce((sum, milestone) => sum + getMilestoneProgress(milestone, tasks), 0) /
      milestones.length
    : taskAverage

  return Math.round((taskAverage + milestoneAverage) / 2)
}

const recalcPlan = (plan: Plan): Plan => {
  const normalizedTasks = sortAndReindexTasks(plan.tasks)
  const normalizedMilestones = plan.milestones.map((milestone) => ({
    ...milestone,
    status: calculateMilestoneStatus(milestone, normalizedTasks),
  }))

  return {
    ...plan,
    tasks: normalizedTasks,
    milestones: normalizedMilestones,
    progress: calculatePlanProgress(normalizedTasks, normalizedMilestones),
  }
}

export const usePlanStore = create<AppState>()(
  persist(
    (set, get) => ({
      plans: Object.keys(initialPlans).reduce<Record<PlanId, Plan>>((acc, key) => {
        const planId = key as PlanId
        acc[planId] = recalcPlan(initialPlans[planId])
        return acc
      }, {} as Record<PlanId, Plan>),
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

      createTask: (planId, taskData) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const timestamp = new Date().toISOString()
          const status = taskData.status
          const percent = status === 'done' ? 100 : clamp(taskData.percentComplete ?? 0, 0, 100)
          const nextOrder =
            plan.tasks.filter((task) => task.status === status).reduce((max, task) => Math.max(max, task.order), -1) +
            1

          const newTask: Task = {
            id: generateId(),
            title: taskData.title,
            description: taskData.description,
            status,
            dueDate: taskData.dueDate,
            assignee: taskData.assignee,
            percentComplete: percent,
            milestoneId: taskData.milestoneId,
            priority: taskData.priority,
            order: nextOrder,
            createdAt: timestamp,
            updatedAt: timestamp,
          }

          const updatedPlan = recalcPlan({
            ...plan,
            tasks: [...plan.tasks, newTask],
            milestones: syncMilestoneTaskLinks(plan.milestones, newTask.id, newTask.milestoneId),
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      updateTask: (planId, taskId, updates) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const existing = plan.tasks.find((task) => task.id === taskId)
          if (!existing) return state

          const timestamp = new Date().toISOString()
          const nextStatus = updates.status ?? existing.status
          const percentComplete = updates.percentComplete !== undefined ? clamp(updates.percentComplete, 0, 100) : existing.percentComplete
          const normalizedPercent = nextStatus === 'done' ? 100 : percentComplete

          const nextMilestoneId = updates.milestoneId === undefined ? existing.milestoneId : updates.milestoneId

          const updatedTask: Task = {
            ...existing,
            ...updates,
            status: nextStatus,
            percentComplete: normalizedPercent,
            milestoneId: nextMilestoneId,
            updatedAt: timestamp,
          }

          if (existing.status !== nextStatus) {
            const nextOrder =
              plan.tasks
                .filter((task) => task.id !== taskId && task.status === nextStatus)
                .reduce((max, task) => Math.max(max, task.order), -1) + 1
            updatedTask.order = nextOrder
          }

          const tasks = plan.tasks.map((task) => (task.id === taskId ? updatedTask : task))
          const milestones = syncMilestoneTaskLinks(plan.milestones, taskId, nextMilestoneId)

          const updatedPlan = recalcPlan({
            ...plan,
            tasks,
            milestones,
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      deleteTask: (planId, taskId) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const tasks = plan.tasks.filter((task) => task.id !== taskId)
          const milestones = plan.milestones.map((milestone) => ({
            ...milestone,
            taskIds: milestone.taskIds.filter((id) => id !== taskId),
          }))

          const updatedPlan = recalcPlan({
            ...plan,
            tasks,
            milestones,
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      moveTask: (planId, taskId, status, targetIndex) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const existing = plan.tasks.find((task) => task.id === taskId)
          if (!existing) return state

          const timestamp = new Date().toISOString()
          const grouped = groupTasksByStatus(plan.tasks)

          grouped[existing.status] = grouped[existing.status].filter((task) => task.id !== taskId)

          const updatedTask: Task = {
            ...existing,
            status,
            percentComplete: status === 'done' ? 100 : existing.percentComplete,
            updatedAt: timestamp,
          }

          const safeIndex = Math.max(0, Math.min(targetIndex, grouped[status].length))
          grouped[status].splice(safeIndex, 0, updatedTask)

          const tasks = sortAndReindexTasks(
            TASK_STATUS_ORDER.flatMap((taskStatus) => grouped[taskStatus])
          )

          const updatedPlan = recalcPlan({
            ...plan,
            tasks,
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      createMilestone: (planId, milestoneData) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const newMilestone: Milestone = {
            id: generateId(),
            title: milestoneData.title,
            targetDate: milestoneData.targetDate,
            status: milestoneData.status,
            notes: milestoneData.notes,
            taskIds: milestoneData.taskIds ?? [],
            completionThreshold: milestoneData.completionThreshold,
            manualProgress: milestoneData.manualProgress,
            statusOverride: milestoneData.statusOverride,
          }

          const updatedPlan = recalcPlan({
            ...plan,
            milestones: [...plan.milestones, newMilestone],
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      updateMilestone: (planId, milestoneId, updates) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const milestones = plan.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? {
                  ...milestone,
                  ...updates,
                  taskIds: updates.taskIds ? [...updates.taskIds] : milestone.taskIds,
                }
              : milestone
          )

          const targetMilestone = milestones.find((milestone) => milestone.id === milestoneId)
          const nextTaskIds = targetMilestone?.taskIds ?? []

          const tasks = plan.tasks.map((task) => {
            if (nextTaskIds.includes(task.id)) {
              return { ...task, milestoneId: milestoneId }
            }
            if (task.milestoneId === milestoneId && !nextTaskIds.includes(task.id)) {
              return { ...task, milestoneId: undefined }
            }
            return task
          })

          const updatedPlan = recalcPlan({
            ...plan,
            tasks,
            milestones,
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      deleteMilestone: (planId, milestoneId) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const milestones = plan.milestones.filter((milestone) => milestone.id !== milestoneId)
          const tasks = plan.tasks.map((task) =>
            task.milestoneId === milestoneId ? { ...task, milestoneId: undefined } : task
          )

          const updatedPlan = recalcPlan({
            ...plan,
            tasks,
            milestones,
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      linkTaskToMilestone: (planId, taskId, milestoneId) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          const tasks = plan.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  milestoneId,
                  updatedAt: new Date().toISOString(),
                }
              : task
          )

          const milestones = syncMilestoneTaskLinks(plan.milestones, taskId, milestoneId)

          const updatedPlan = recalcPlan({
            ...plan,
            tasks,
            milestones,
          })

          return {
            plans: {
              ...state.plans,
              [planId]: updatedPlan,
            },
          }
        })
      },

      getPlanProgressSummary: (planId): PlanProgressSummary | undefined => {
        const plan = get().plans[planId]
        if (!plan) return undefined

        const tasksByStatus = groupTasksByStatus(plan.tasks)
        const totalTasks = plan.tasks.length
        const completedTasks = tasksByStatus.done.length
        const taskProgress = totalTasks ? (completedTasks / totalTasks) * 100 : 0

        const milestonesByStatus: Record<MilestoneStatus, Milestone[]> = {
          'not-started': [],
          tracking: [],
          'at-risk': [],
          complete: [],
        }

        plan.milestones.forEach((milestone) => {
          milestonesByStatus[milestone.status].push(milestone)
        })

        const milestoneProgress = plan.milestones.length
          ? plan.milestones.reduce((sum, milestone) => sum + getMilestoneProgress(milestone, plan.tasks), 0) /
            plan.milestones.length
          : 0

        const upcomingMilestones = plan.milestones
          .filter((milestone) => milestone.status !== 'complete')
          .sort(
            (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
          )

        return {
          totalTasks,
          completedTasks,
          tasksByStatus,
          milestonesByStatus,
          nextMilestone: upcomingMilestones[0],
          milestoneProgress,
          taskProgress,
        }
      },

      recalcPlanProgress: (planId) => {
        set((state) => {
          const plan = state.plans[planId]
          if (!plan) return state

          return {
            plans: {
              ...state.plans,
              [planId]: recalcPlan(plan),
            },
          }
        })
      },

      recalcAllPlans: () => {
        set((state) => {
          const updatedPlans = Object.entries(state.plans).reduce<Record<PlanId, Plan>>(
            (acc, [key, plan]) => {
              acc[key as PlanId] = recalcPlan(plan)
              return acc
            },
            {} as Record<PlanId, Plan>
          )

          return {
            plans: updatedPlans,
          }
        })
      },
    }),
    {
      name: 'plan-storage',
      version: 1,
    }
  )
)
