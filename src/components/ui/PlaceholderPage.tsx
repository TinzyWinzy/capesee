import { cx } from '@/lib/utils'

/** Wireframe stand-in for screens not yet built. Clearly labeled as a stub. */
export function PlaceholderPage({
  title,
  description,
  note,
  className,
}: {
  title: string
  description?: string
  note?: string
  className?: string
}) {
  return (
    <div className={cx('page', className)}>
      <div className="card">
        <div className="eyebrow">Scaffold stub</div>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="text-muted text-small">{description}</p> : null}
        {note ? (
          <div className="badge badge-info" style={{ marginTop: 8 }}>
            Wireframe in spec §{note}
          </div>
        ) : null}
      </div>
    </div>
  )
}
