import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge, Card } from '@/components/ui'
import { formatRand } from '@/lib/format'

/** A02 detail — booking record with audit sections. */
export function AdminBookingDetailPage({ booking }: { booking: Booking }) {
  return (
    <div className="stack">
      <div className="row-between">
        <div className="row">
          <Link to="/admin/bookings" className="btn btn-ghost btn-sm" aria-label="Back">
            ←
          </Link>
          <h1 className="section-title">{booking.code}</h1>
        </div>
        <Badge tone={booking.status === 'confirmed' ? 'success' : 'default'}>{booking.status}</Badge>
      </div>

      <div className="grid-2">
        <Card className="stack">
          <span className="eyebrow">Customer</span>
          <span className="bold text-small">{booking.travelerName}</span>
        </Card>
        <Card className="stack">
          <span className="eyebrow">Items</span>
          {booking.items.map((i) => (
            <span key={i.productId} className="text-small">
              {i.type} × {i.qty}
            </span>
          ))}
        </Card>
        <Card className="stack">
          <span className="eyebrow">Payments</span>
          <span className="text-small bold">{formatRand(booking.total)}</span>
        </Card>
        <Card className="stack">
          <span className="eyebrow">Guide</span>
          <span className="text-faint text-small">Not assigned</span>
        </Card>
      </div>

      <Card className="stack">
        <span className="eyebrow">Timeline</span>
        {['Created', 'Paid', 'Confirmed'].map((e, i) => (
          <span key={e} className="text-small">
            {i + 1}. {e}
          </span>
        ))}
      </Card>

      <Card className="stack">
        <span className="eyebrow">Audit history</span>
        <span className="text-faint text-xs">Changes logged here once admin mutations land.</span>
      </Card>
    </div>
  )
}
