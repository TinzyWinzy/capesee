import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge, Button, Card } from '@/components/ui'
import { formatDate, formatRand } from '@/lib/format'
import { getProducts } from '@/modules/bookings/api/products'

/** G02 — Guide booking detail. Wireframe spec §23. Trip lifecycle state is local until guide mutations land. */
export function GuideBookingDetailPage({ booking }: { booking: Booking }) {
  const [tripState, setTripState] = useState<'upcoming' | 'started' | 'completed'>('upcoming')
  const catalog = [...getProducts('tour'), ...getProducts('transfer'), ...getProducts('experience'), ...getProducts('stay')]
  const guests = booking.items.reduce((sum, item) => sum + item.qty, 0)
  const headline =
    booking.items
      .map((item) => catalog.find((product) => product.id === item.productId)?.title ?? item.type)
      .filter(Boolean)
      .join(' + ') || 'Booking'

  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/guide/dashboard" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Booking {booking.code}</h1>
      </div>

      <Card className="stack" style={{ marginTop: 14 }}>
        <span className="section-title text-small">{headline}</span>
        <div className="row-between">
          <span className="text-faint text-small">Guest</span>
          <span className="bold text-small">{booking.travelerName}</span>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Guests</span>
          <span className="bold text-small">{guests}</span>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Dates</span>
          <span className="bold text-small">{formatDate(booking.dates.start)} – {formatDate(booking.dates.end)}</span>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Status</span>
          <Badge tone={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'info'}>
            {booking.status}
          </Badge>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Total</span>
          <span className="bold text-small">{formatRand(booking.total)}</span>
        </div>
        <hr className="hairline" style={{ margin: '4px 0' }} />

        {tripState === 'upcoming' ? (
          <>
            <Button variant="primary" onClick={() => setTripState('started')}>Start Trip</Button>
            <Link to="/guide/check-in" className="btn btn-outline block">Scan Ticket</Link>
          </>
        ) : null}

        {tripState === 'started' ? (
          <>
            <Badge tone="info">Trip in progress</Badge>
            <Link to="/guide/check-in" className="btn btn-outline block">Scan Ticket</Link>
            <Button variant="ghost" onClick={() => setTripState('completed')}>Mark Complete</Button>
          </>
        ) : null}

        {tripState === 'completed' ? (
          <Badge tone="success">Trip completed</Badge>
        ) : null}
      </Card>
    </div>
  )
}
