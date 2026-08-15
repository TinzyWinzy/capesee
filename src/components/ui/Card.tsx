import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Remove card padding for media-heavy layouts. */
  flush?: boolean
}

export function Card({ children, flush, className, ...rest }: CardProps) {
  return (
    <div className={cx('card', flush && 'card-pad-0', className)} {...rest}>
      {children}
    </div>
  )
}
