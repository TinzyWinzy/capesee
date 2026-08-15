import { Link } from '@tanstack/react-router'
import type { BookableProduct } from '@/types'
import { Card, PriceDisplay, RatingDisplay } from '.'

export function TourCard({ tour }: { tour: BookableProduct }) {
  return (
    <Link to="/book/tours/$tourSlug" params={{ tourSlug: tour.slug }}>
      <Card flush className="card-link editorial-card tour-card">
        <div className="media editorial-card-media">{tour.coverUrl ? <img src={tour.coverUrl} alt={tour.title} /> : <div className="editorial-media-placeholder tour-placeholder"><span>Guided through the Cape</span></div>}</div>
        <div className="editorial-card-body">
          <div className="editorial-card-heading">
            <strong>{tour.title}</strong>
            <RatingDisplay rating={tour.rating} reviewCount={tour.reviewCount} />
          </div>
          <span className="editorial-card-meta">{tour.durationHours}h guided experience</span>
          <PriceDisplay amount={tour.price} unit="/person" />
        </div>
      </Card>
    </Link>
  )
}
