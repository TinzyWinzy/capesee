import { Link } from '@tanstack/react-router'
import type { Place } from '@/types'
import { Card, RatingDisplay, SourceBadge, VerificationBadge } from '.'
import { ResponsiveImage } from '@/components/ResponsiveImage'

export function PlaceCard({ place }: { place: Place }) {
  return (
    <Link to="/discover/places/$placeSlug" params={{ placeSlug: place.slug }}>
      <Card flush className="card-link editorial-card place-card">
        <div className="media editorial-card-media">{place.coverUrl ? <ResponsiveImage src={place.coverUrl} alt={place.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="editorial-media-placeholder place-placeholder"><span>Place record</span></div>}</div>
        <div className="editorial-card-body">
          <div className="editorial-card-heading">
            <strong>{place.name}</strong>
            <RatingDisplay rating={place.rating} />
          </div>
          <span className="editorial-card-meta">
            {place.locationName} • {place.type}
          </span>
          <div className="row wrap">
            {place.verified ? <VerificationBadge /> : null}
            <SourceBadge count={place.sourceCount} />
            <span className="badge">{place.pinCount} discoveries</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
