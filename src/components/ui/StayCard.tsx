import { Link } from '@tanstack/react-router'
import type { BookableProduct } from '@/types'
import { Card, PriceDisplay, RatingDisplay } from '.'

export function StayCard({ stay }: { stay: BookableProduct }) {
  return (
    <Link to="/book/stays/$hotelSlug" params={{ hotelSlug: stay.slug }}>
      <Card flush className="card-link">
        <div className="media ratio-16-9">{stay.coverUrl ? <img src={stay.coverUrl} alt={stay.title} /> : <div className="media-fallback stay-placeholder">{stay.title}</div>}</div>
        <div className="col" style={{ padding: 12, gap: 4 }}>
          <div className="row-between">
            <span className="bold">{stay.title}</span>
            <RatingDisplay rating={stay.rating} />
          </div>
          <span className="text-faint text-xs">{stay.regionSlug}</span>
          <PriceDisplay amount={stay.price} unit="/night" />
        </div>
      </Card>
    </Link>
  )
}
