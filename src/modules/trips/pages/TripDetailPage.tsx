import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge, Button, Card } from '@/components/ui'
import { formatDate } from '@/lib/format'

/** T15 — Trip detail: today/tomorrow schedule, offline ticket, emergency support. Wireframe spec §17. */
export function TripDetailPage({ booking }: { booking: Booking }) {
  return (
    <div className="page-narrow">
      <div className="row" style={{ marginBottom: 6 }}>
        <Link to="/trips" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title" style={{ fontSize: 20 }}>
          {booking.regionSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Trip
        </h1>
      </div>
      <p className="text-faint text-small" style={{ marginBottom: 14 }}>
        {formatDate(booking.dates.start)} – {formatDate(booking.dates.end)} • {booking.code}
      </p>

      <div className="stack">
        <section>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Today
          </div>
          <Card className="row-between">
            <div className="col" style={{ gap: 2 }}>
              <span className="bold text-small">08:00 — Airport transfer</span>
              <span className="text-faint text-xs">Driver: Mike</span>
            </div>
            <Button variant="outline" size="sm">
              Track driver
            </Button>
          </Card>
          <Card className="row-between">
            <div className="col" style={{ gap: 2 }}>
              <span className="bold text-small">11:00 — Hotel check-in</span>
              <span className="text-faint text-xs">Cape Lodge</span>
            </div>
            <Badge tone="gold">Next</Badge>
          </Card>
        </section>

        <section>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Tomorrow
          </div>
          <Card className="row-between">
            <div className="col" style={{ gap: 2 }}>
              <span className="bold text-small">08:30 — Stellenbosch Wine Tour</span>
              <span className="text-faint text-xs">2 guests</span>
            </div>
            <Link to="/trips/$bookingId/ticket" params={{ bookingId: booking.id }}>
              <Button variant="ink" size="sm">
                Ticket
              </Button>
            </Link>
          </Card>
        </section>

        <section className="grid-2">
          <Link to="/trips/$bookingId/itinerary" params={{ bookingId: booking.id }}>
            <Button variant="outline" block>
              Full itinerary
            </Button>
          </Link>
          <Link to="/trips/$bookingId/ticket" params={{ bookingId: booking.id }}>
            <Button variant="outline" block>
              Offline Ticket
            </Button>
          </Link>
        </section>

        <Link to="/trips/$bookingId/support" params={{ bookingId: booking.id }}>
          <Button variant="ghost" block>
            Emergency Support
          </Button>
        </Link>
      </div>
    </div>
  )
}
