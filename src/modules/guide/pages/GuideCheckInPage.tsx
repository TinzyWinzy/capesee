import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Card } from '@/components/ui'

/** G03 — QR check-in. Wireframe spec §24. */
export function GuideCheckInPage() {
  const [scanned, setScanned] = useState(false)

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ textAlign: 'center', marginBottom: 16 }}>
        Scan Guest Ticket
      </h1>

      {!scanned ? (
        <div className="media ratio-1-1" style={{ border: '2px solid var(--color-ink)' }}>
          <div className="state">
            <div
              style={{
                width: 150,
                height: 150,
                border: '2px dashed var(--color-ink-faint)',
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--color-ink-faint)',
              }}
            >
              Scan QR Here
            </div>
            <span className="text-faint text-xs">Camera view (mock)</span>
            <Button variant="primary" onClick={() => setScanned(true)}>
              Simulate scan
            </Button>
          </div>
        </div>
      ) : (
        <Card className="col" style={{ alignItems: 'center', padding: 32, gap: 6 }}>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 24, background: 'var(--color-success)', color: '#fff', border: 'none' }}>
            ✓
          </div>
          <div className="section-title">Sarah Williams</div>
          <span className="text-faint text-small">Booking confirmed</span>
          <span className="badge badge-ink">2 Guests</span>
          <Button variant="primary" block style={{ marginTop: 12 }}>
            Check In
          </Button>
          <Link to="/guide/check-in">
            <Button variant="ghost" size="sm">
              Scan another
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
