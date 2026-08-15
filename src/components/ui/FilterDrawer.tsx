import type { ReactNode } from 'react'
import { Button } from './Button'
import { cx } from '@/lib/utils'

/** Bottom-sheet style filter drawer. Mobile-first. */
export function FilterDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-overlay)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className={cx('card')}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '80vh',
          overflowY: 'auto',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderBottom: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row-between">
          <span className="section-title">Filters</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
