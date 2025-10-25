import { Tab } from '@headlessui/react'
import type { ComponentType, ReactNode } from 'react'
import {
  HomeIcon,
  FlagIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/outline'
import type { TabType } from '../../types'

interface TabMeta {
  id: TabType
  label: string
  icon: ComponentType<{ className?: string }>
}

interface TabNavigationProps {
  activeTab: TabType
  onChange: (tab: TabType) => void
  children: ReactNode
}

export const tabDefinitions: TabMeta[] = [
  { id: 'overview', label: 'Overview', icon: HomeIcon },
  { id: 'milestones', label: 'Milestones', icon: FlagIcon },
  { id: 'tasks', label: 'Tasks', icon: ClipboardDocumentListIcon },
  { id: 'budget', label: 'Budget', icon: BanknotesIcon },
  { id: 'kpis', label: 'KPIs', icon: ChartBarIcon },
  { id: 'risks', label: 'Risks', icon: ExclamationTriangleIcon },
  { id: 'notes', label: 'Notes', icon: DocumentTextIcon },
  { id: 'resources', label: 'Resources', icon: FolderOpenIcon },
]

export function TabNavigation({ activeTab, onChange, children }: TabNavigationProps) {
  const selectedIndex = tabDefinitions.findIndex((tab) => tab.id === activeTab)

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={(index) => onChange(tabDefinitions[index].id)}>
      <Tab.List className="border-b border-slate-700">
        <div className="flex space-x-1 overflow-x-auto px-2 md:px-0">
          {tabDefinitions.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `flex items-center space-x-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                  selected
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`
              }
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Tab>
          ))}
        </div>
      </Tab.List>
      {children}
    </Tab.Group>
  )
}
