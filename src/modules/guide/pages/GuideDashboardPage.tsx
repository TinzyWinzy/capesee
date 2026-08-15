import { Link } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'

/** G01 — Guide dashboard. Wireframe spec §22. */
export function GuideDashboardPage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ fontSize: 20 }}>
        Good morning, Mike
      </h1>
      <p className="text-faint text-small" style={{ marginBottom: 16 }}>
        Tuesday 11 August
      </p>

      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Today
      </div>
      <div className="stack">
        <Card className="row-between">
          <div className="col" style={{ gap: 2 }}>
            <span className="bold text-small">08:30 — Airport Pickup</span>
            <span className="text-faint text-xs">2 guests</span>
          </div>
          <Link to="/guide/booking/$bookingId" params={{ bookingId: 'b-1' }}>
            <Button variant="ink" size="sm">
              Open booking
            </Button>
          </Link>
        </Card>
        <Card className="row-between">
          <div className="col" style={{ gap: 2 }}>
            <span className="bold text-small">11:00 — Stellenbosch Tour</span>
            <span className="text-faint text-xs">8 guests</span>
          </div>
          <Button variant="outline" size="sm">
            Guest manifest
          </Button>
        </Card>
        <Card className="row-between">
          <div className="col" style={{ gap: 2 }}>
            <span className="bold text-small">16:30 — Hotel Transfer</span>
            <span className="text-faint text-xs">Cape Grace Hotel</span>
          </div>
          <Link to="/guide/transfer/$bookingId" params={{ bookingId: 'b-1' }}>
            <Button variant="outline" size="sm">
              Track
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
