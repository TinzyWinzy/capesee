import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

type Tone = 'default' | 'accent' | 'gold' | 'success' | 'info' | 'danger' | 'ink'

export function Badge({ tone = 'default', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('badge', tone !== 'default' && `badge-${tone}`, className)}>{children}</span>
}
