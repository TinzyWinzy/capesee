import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Pin } from '@/types'
import { TravelerReportBadge } from '@/components/ui'
import { getPlaceById } from '@/lib/mock'
import { timeAgo } from '@/lib/format'

/** T08 — Pin detail. Wireframe spec §10. Likes toggle locally until social actions land. */
export function PinDetailPage({ pin }: { pin: Pin }) {
  const place = pin.placeId ? getPlaceById(pin.placeId) : undefined
  const [liked, setLiked] = useState(false)
  const likeCount = pin.likes + (liked ? 1 : 0)

  return (
    <div className="page-narrow">
      <div className="row" style={{ marginBottom: 12 }}>
        <Link to="/journal" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Discovery</h1>
      </div>

      <div className="media ratio-4-3 media-fallback">
        {pin.photoUrl ? <img src={pin.photoUrl} alt={pin.title} /> : <span>{pin.title}</span>}
      </div>

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
          <span aria-hidden>◉</span> {place?.name ?? 'Unmapped location'}
        </div>

        {pin.description ? <p className="text-muted text-small">{pin.description}</p> : null}

        {place ? (
          <div className="card">
            <div className="eyebrow">Capesee context</div>
            <p className="text-small text-muted">This observation happened near {place.name}. Read its history and other discoveries.</p>
            <Link to="/discover/places/$placeSlug" params={{ placeSlug: place.slug }} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
              Explore place
            </Link>
          </div>
        ) : null}

        <div className="row">
          <button
            type="button"
            className={liked ? 'chip chip-active' : 'chip'}
            onClick={() => setLiked((value) => !value)}
            aria-pressed={liked}
          >
            ♡ {likeCount} {liked ? '· liked' : ''}
          </button>
          <span className="text-faint text-xs" style={{ alignSelf: 'center' }}>
            {pin.comments} comments · reactions and replies ship with social actions
          </span>
        </div>
      </div>
    </div>
  )
}
