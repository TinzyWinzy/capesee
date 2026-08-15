import { Link } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'

/** Trip support — emergency contacts. */
export function TripSupportPage() {
  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/trips/$bookingId" params={{ bookingId: 'b-1' }} className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Emergency Support</h1>
      </div>

      <div className="stack" style={{ marginTop: 14 }}>
        <Card className="row-between">
          <div className="col" style={{ gap: 2 }}>
            <span className="bold text-small">Capesee 24/7 line</span>
            <span className="text-faint text-xs">For anything before or during your trip</span>
          </div>
          <Button variant="ink" size="sm">
            Call
          </Button>
        </Card>
        <Card className="row-between">
          <div className="col" style={{ gap: 2 }}>
            <span className="bold text-small">WhatsApp support</span>
            <span className="text-faint text-xs">Fastest for trip questions</span>
          </div>
          <Button variant="outline" size="sm">
            WhatsApp
          </Button>
        </Card>
        <Card className="row-between">
          <div className="col" style={{ gap: 2 }}>
            <span className="bold text-small">Local emergency</span>
            <span className="text-faint text-xs">Police 10111 • Ambulance 10177</span>
          </div>
          <Button variant="outline" size="sm">
            Dial
          </Button>
        </Card>
      </div>
    </div>
  )
}
