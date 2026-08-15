import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Button, Card } from '@/components/ui'

/** G02 — Guide booking detail. Wireframe spec §23. */
export function GuideBookingDetailPage({ booking }: { booking: Booking }) {
  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/guide/dashboard" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Booking</h1>
      </div>

      <Card className="stack" style={{ marginTop: 14 }}>
        <span className="section-title text-small">Stellenbosch Wine Experience</span>
        <div className="row-between">
          <span className="text-faint text-small">Guest</span>
          <span className="bold text-small">{booking.travelerName}</span>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Guests</span>
          <span className="bold text-small">{booking.items.reduce((a, i) => a + i.qty, 0)}</span>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Pickup</span>
          <span className="bold text-small">Cape Grace Hotel</span>
        </div>
        <div className="row">
          <Button variant="ink" size="sm">
            Call
          </Button>
          <Button variant="outline" size="sm">
            WhatsApp
          </Button>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">08:30 pickup</span>
          <Button variant="outline" size="sm">
            Directions
          </Button>
        </div>
        <hr className="hairline" style={{ margin: '4px 0' }} />
        <Button variant="primary">Start Trip</Button>
        <Link to="/guide/check-in">
          <Button variant="outline" block>
            Scan Ticket
          </Button>
        </Link>
        <Button variant="ghost">Mark Complete</Button>
      </Card>
    </div>
  )
}
