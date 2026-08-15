import { Link } from '@tanstack/react-router'
import type { Pin } from '@/types'
import { distanceLabel, timeAgo } from '@/lib/format'
import { Card, TravelerReportBadge } from '.'

export function DiscoveryCard({ pin, distanceMeters, showBadge = true }: { pin: Pin; distanceMeters?: number; showBadge?: boolean }) {
  return (
    <Link to="/journal/pin/$pinId" params={{ pinId: pin.id }}>
      <Card flush className="card-link editorial-card discovery-card">
        <div className="media editorial-card-media">{pin.photoUrl ? <img src={pin.photoUrl} alt={pin.title} /> : <div className="editorial-media-placeholder discovery-placeholder"><span>Traveler field note</span></div>}</div>
        <div className="editorial-card-body">
          <div className="editorial-card-heading">
            <strong>{pin.title}</strong>
            <span className="text-faint text-xs">{distanceMeters !== undefined ? distanceLabel(distanceMeters) : timeAgo(pin.createdAt)}</span>
          </div>
          <span className="editorial-card-meta">
            {pin.authorName} • {timeAgo(pin.createdAt)}
          </span>
          {showBadge ? <TravelerReportBadge /> : null}
        </div>
      </Card>
    </Link>
  )
}
