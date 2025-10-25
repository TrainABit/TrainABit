import type { ComponentType } from 'react'
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
import type { TabType } from '../types'

export interface TabMeta {
  id: TabType
  label: string
  icon: ComponentType<{ className?: string }>
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
