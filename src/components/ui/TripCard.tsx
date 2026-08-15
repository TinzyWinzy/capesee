import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { formatDate } from '@/lib/format'
import { Card, Badge } from '.'

export function TripCard({ booking }: { booking: Booking }) {
  return (
    <Link to="/trips/$bookingId" params={{ bookingId: booking.id }}>
      <Card className="card-link">
        <div className="eyebrow">{booking.regionSlug.replace(/-/g, ' ').toUpperCase()}</div>
        <div className="section-title">
          {formatDate(booking.dates.start)} – {formatDate(booking.dates.end)}
        </div>
        <div className="row-between">
          <span className="text-muted text-small">{booking.items.length} bookings</span>
          <Badge tone={booking.status === 'confirmed' ? 'success' : 'default'}>{booking.status}</Badge>
        </div>
      </Card>
    </Link>
  )
}
