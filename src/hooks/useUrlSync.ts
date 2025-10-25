import { useEffect } from 'react'
import type { PlanId, TabType } from '../types'

const VALID_TABS: TabType[] = [
  'overview',
  'milestones',
  'tasks',
  'budget',
  'kpis',
  'risks',
  'notes',
  'resources',
]

export function useUrlSync(
  activeTab: TabType,
  setActiveTab: (tab: TabType) => void,
  selectedPlanId: PlanId,
  setSelectedPlan: (planId: PlanId) => void,
  availablePlanIds: PlanId[],
) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const applyUrlState = () => {
      const url = new URL(window.location.href)
      const hashTab = url.hash ? url.hash.replace('#', '') : null
      const queryTab = url.searchParams.get('tab')
      const preferredTab = (queryTab ?? hashTab) as TabType | null

      if (preferredTab && VALID_TABS.includes(preferredTab)) {
        setActiveTab(preferredTab)
      }

      const planParam = url.searchParams.get('plan') as PlanId | null
      if (planParam && availablePlanIds.includes(planParam)) {
        setSelectedPlan(planParam)
      }
    }

    applyUrlState()

    window.addEventListener('popstate', applyUrlState)
    window.addEventListener('hashchange', applyUrlState)

    return () => {
      window.removeEventListener('popstate', applyUrlState)
      window.removeEventListener('hashchange', applyUrlState)
    }
  }, [availablePlanIds, setActiveTab, setSelectedPlan])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.set('plan', selectedPlanId)
    url.searchParams.set('tab', activeTab)
    url.hash = activeTab

    const newPath = `${url.pathname}${url.search}${url.hash}`
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== newPath) {
      window.history.replaceState(null, '', newPath)
    }
  }, [activeTab, selectedPlanId])
}
