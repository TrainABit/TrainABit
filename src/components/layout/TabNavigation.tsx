import { Tab } from '@headlessui/react'
import type { ReactNode } from 'react'
import type { TabType } from '../../types'
import { tabDefinitions } from '../../constants/tabs'

interface TabNavigationProps {
  activeTab: TabType
  onChange: (tab: TabType) => void
  children: ReactNode
}

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
