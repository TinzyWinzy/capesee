import type { Booking } from '@/types'
import { formatRand } from '@/lib/format'
import { Card, Badge } from '.'

export function BookingCard({ booking, onClick }: { booking: Booking; onClick?: () => void }) {
  return (
    <Card className="card-link" onClick={onClick}>
      <div className="row-between">
        <span className="bold">{booking.code}</span>
        <Badge tone={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'gold' : 'default'}>
          {booking.status}
        </Badge>
      </div>
      <span className="text-muted text-small">{booking.travelerName}</span>
      <div className="row-between" style={{ marginTop: 4 }}>
        <span className="text-faint text-xs">{booking.items.map((i) => i.type).join(' + ')}</span>
        <span className="bold">{formatRand(booking.total)}</span>
      </div>
    </Card>
  )
}
