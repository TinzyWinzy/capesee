import { cx } from '@/lib/utils'

/** Loading placeholder used while a screen fetches data. */
export function SkeletonCard({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cx('card', className)}>
      <div className="skeleton ratio-16-9" />
      <div className="col" style={{ gap: 6, marginTop: 10 }}>
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 12, width: `${100 - i * 15}%` }} />
        ))}
      </div>
    </div>
  )
}
