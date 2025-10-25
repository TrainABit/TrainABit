import { InboxIcon } from '@heroicons/react/24/outline'
import type { ComponentType, ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ 
  icon: Icon = InboxIcon, 
  title, 
  description,
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <Icon className="mx-auto h-12 w-12 text-slate-500" />
      <h3 className="mt-4 text-lg font-medium text-slate-200">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
