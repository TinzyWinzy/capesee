import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Button, Card } from '@/components/ui'
import { useState } from 'react'

/** Trip transfer — driver status for the traveler side. */
export function TripTransferPage({ booking }: { booking: Booking }) {
  const [status, setStatus] = useState<'waiting' | 'onboard' | 'arrived'>('waiting')
  const [sharing, setSharing] = useState(false)

  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/trips/$bookingId" params={{ bookingId: booking.id }} className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Airport Transfer</h1>
      </div>

      <Card className="stack" style={{ marginTop: 14 }}>
        <span className="text-faint text-small">Destination</span>
        <span className="bold">Cape Grace Hotel</span>
        <hr className="hairline" style={{ margin: '4px 0' }} />
        <div className="stack" style={{ gap: 6 }}>
          {(
            [
              ['waiting', 'Waiting'],
              ['onboard', 'Guest onboard'],
              ['arrived', 'Arrived'],
            ] as const
          ).map(([key, label]) => (
            <button key={key} type="button" className="btn btn-ghost btn-block" onClick={() => setStatus(key)} style={{ gap: 10, justifyContent: 'flex-start', padding: '6px 0' }}>
              <span className="avatar" style={{ width: 18, height: 18, fontSize: 10, background: status === key ? 'var(--color-accent)' : 'var(--color-surface-2)', border: 'none', color: status === key ? '#fff' : 'var(--color-ink-faint)' }}>
                {status === key ? '●' : '○'}
              </span>
              <span className="text-small">{label}</span>
            </button>
          ))}
        </div>
        <Button variant={sharing ? 'ink' : 'primary'} onClick={() => setSharing((v) => !v)}>
          {sharing ? 'Location sharing active' : 'Start Live Location'}
        </Button>
        {sharing ? <span className="text-faint text-xs">Updated 14 seconds ago</span> : null}
      </Card>
    </div>
  )
}
