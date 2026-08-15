import type { ReactNode } from 'react'

export function EmptyState({ icon = '◌', title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="state">
      <div className="state-icon">{icon}</div>
      <div className="state-title">{title}</div>
      {description ? <div className="state-desc">{description}</div> : null}
      {action}
    </div>
  )
}
