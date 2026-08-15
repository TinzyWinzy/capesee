import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge, Card, QRViewer } from '@/components/ui'
import { formatDate } from '@/lib/format'

/** T16 — Offline ticket with QR. Wireframe spec §18. */
export function OfflineTicketPage({ booking }: { booking: Booking }) {
  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/trips/$bookingId" params={{ bookingId: booking.id }} className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Capesee Ticket</h1>
      </div>

      <Card className="col" style={{ marginTop: 14, alignItems: 'center', gap: 8, padding: 24 }}>
        <span className="section-title">Stellenbosch Wine Experience</span>
        <span className="text-faint text-small">
          {formatDate(booking.dates.start)} • 08:30
        </span>
        <QRViewer value={booking.code} />
        <div className="col" style={{ alignItems: 'center', gap: 2 }}>
          <span className="bold">{booking.code}</span>
          <span className="text-faint text-xs">Guests: {booking.items.reduce((a, i) => a + i.qty, 0)}</span>
        </div>
        <Badge tone="ink">✓ Available offline</Badge>
      </Card>
    </div>
  )
}
