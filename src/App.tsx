import { Tab } from '@headlessui/react'
import { useMemo } from 'react'
import { usePlanStore } from './store/usePlanStore'
import { useUrlSync } from './hooks/useUrlSync'
import { AppLayout } from './components/layout/AppLayout'
import { TabNavigation } from './components/layout/TabNavigation'
import { PlanSidebar } from './components/sidebar/PlanSidebar'
import { OverviewPanel } from './components/panels/OverviewPanel'
import { MilestonesPanel } from './components/panels/MilestonesPanel'
import { TasksPanel } from './components/panels/TasksPanel'
import { BudgetPanel } from './components/panels/BudgetPanel'
import { KPIsPanel } from './components/panels/KPIsPanel'
import { RisksPanel } from './components/panels/RisksPanel'
import { NotesPanel } from './components/panels/NotesPanel'
import { ResourcesPanel } from './components/panels/ResourcesPanel'
import type { PlanId } from './types'

function App() {
  const { activeTab, setActiveTab, isLoading, plans, selectedPlanId, setSelectedPlan } = usePlanStore((state) => ({
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    isLoading: state.isLoading,
    plans: state.plans,
    selectedPlanId: state.selectedPlanId,
    setSelectedPlan: state.setSelectedPlan,
  }))

  const availablePlanIds = useMemo(() => Object.keys(plans) as PlanId[], [plans])

  useUrlSync(activeTab, setActiveTab, selectedPlanId, setSelectedPlan, availablePlanIds)

  const selectedPlan = plans[selectedPlanId]

  return (
    <AppLayout
      sidebar={PlanSidebar}
      headerTitle={selectedPlan?.name ?? 'Plan Overview'}
      headerSubtitle="Track progress, milestones, and key metrics"
    >
      <TabNavigation activeTab={activeTab} onChange={setActiveTab}>
        <Tab.Panels className="mt-6">
          <Tab.Panel className="focus:outline-none">
            <OverviewPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <MilestonesPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <TasksPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <BudgetPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <KPIsPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <RisksPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <NotesPanel isLoading={isLoading} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <ResourcesPanel isLoading={isLoading} />
          </Tab.Panel>
        </Tab.Panels>
      </TabNavigation>
    </AppLayout>
  )
}

export default App
