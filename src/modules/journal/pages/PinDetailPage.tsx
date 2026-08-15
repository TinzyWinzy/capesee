import { Link } from '@tanstack/react-router'
import type { Pin } from '@/types'
import { Button, TravelerReportBadge } from '@/components/ui'
import { getPlaceBySlug } from '@/lib/mock'
import { timeAgo } from '@/lib/format'

/** T08 — Pin detail. Wireframe spec §10. */
export function PinDetailPage({ pin }: { pin: Pin }) {
  const place = pin.placeId ? getPlaceBySlug(pin.placeId) : undefined

  return (
    <div className="page-narrow">
      <div className="row" style={{ marginBottom: 12 }}>
        <Link to="/journal" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Discovery</h1>
      </div>

      <div className="media ratio-4-3">{pin.photoUrl ? <img src={pin.photoUrl} alt={pin.title} /> : <span>{pin.title}</span>}</div>

      <div className="stack" style={{ marginTop: 14 }}>
        <h2 className="section-title" style={{ fontSize: 18 }}>
          {pin.title}
        </h2>
        <div className="row">
          <span className="text-faint text-small">
            {pin.authorName} • {timeAgo(pin.createdAt)}
          </span>
          <TravelerReportBadge />
        </div>

        <div className="badge badge-ink" style={{ alignSelf: 'flex-start' }}>
          📍 {place?.name ?? 'Unmapped location'}
        </div>

        {pin.description ? <p className="text-muted text-small">{pin.description}</p> : null}

        {place ? (
          <div className="card">
            <div className="eyebrow">Capesee context</div>
            <p className="text-small text-muted">This observation happened near {place.name}. Read its history and other discoveries.</p>
            <Link to="/discover/places/$placeSlug" params={{ placeSlug: place.slug }}>
              <Button variant="outline" size="sm" style={{ marginTop: 8 }}>
                Explore place
              </Button>
            </Link>
          </div>
        ) : null}

        <div className="row">
          <Button variant="ghost" size="sm">♡ {pin.likes}</Button>
          <Button variant="ghost" size="sm">💬 {pin.comments}</Button>
          <Button variant="ghost" size="sm">Share</Button>
        </div>
      </div>
    </div>
  )
}
