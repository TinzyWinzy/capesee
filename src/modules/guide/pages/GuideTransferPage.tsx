import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { getBookingById } from '@/modules/bookings/api/orders'
import { formatDate } from '@/lib/format'

/** G04 — Driver / transfer tracking. Wireframe spec §25. */
export function GuideTransferPage({ bookingId }: { bookingId?: string }) {
  const [status, setStatus] = useState<'waiting' | 'onboard' | 'arrived'>('waiting')
  const [sharing, setSharing] = useState(false)
  const booking = bookingId ? getBookingById(bookingId) : undefined
  const travelerName = booking?.travelerName ?? 'Traveler'

  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/guide/dashboard" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Transfer {booking?.code ?? ''}</h1>
      </div>

      <Card className="stack" style={{ marginTop: 14 }}>
        <span className="bold text-small">{travelerName}</span>
        <div className="row-between">
          <span className="text-faint text-small">Service date</span>
          <span className="text-small bold">{booking ? formatDate(booking.dates.start) : '—'}</span>
        </div>
        <div className="row-between">
          <span className="text-faint text-small">Guests</span>
          <span className="text-small bold">{booking ? booking.items.reduce((sum, item) => sum + item.qty, 0) : '—'}</span>
        </div>
        <hr className="hairline" style={{ margin: '4px 0' }} />
        <div className="stack" style={{ gap: 6 }}>
          {(
            [
              ['waiting', 'Waiting'],
              ['onboard', 'Guest onboard'],
              ['arrived', 'Arrived'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              className="row"
              style={{ gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              onClick={() => setStatus(key)}
            >
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
