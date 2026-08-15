import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/format'

/** Trip itinerary — cached for offline. */
export function TripItineraryPage({ booking }: { booking: Booking }) {
  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/trips/$bookingId" params={{ bookingId: booking.id }} className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Itinerary</h1>
      </div>

      <div className="timeline" style={{ marginTop: 16 }}>
        {booking.items.map((item) => (
          <div key={item.productId} className="timeline-event">
            <div className="row-between">
              <span className="bold text-small">{item.type.toUpperCase()}</span>
              <Badge tone={booking.status === 'confirmed' ? 'success' : 'default'}>{booking.status}</Badge>
            </div>
            <span className="text-muted text-small">Qty {item.qty}</span>
            <span className="text-faint text-xs">{formatDate(booking.dates.start)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
