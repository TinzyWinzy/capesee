import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge, Card } from '@/components/ui'
import { formatDate } from '@/lib/format'
import { getProducts } from '@/modules/bookings/api/products'

/** T15 — Trip detail: the booking's confirmed items, offline ticket, emergency support. Wireframe spec §17. */
export function TripDetailPage({ booking }: { booking: Booking }) {
  const catalog = useMemo(
    () => [
      ...getProducts('tour'),
      ...getProducts('transfer'),
      ...getProducts('experience'),
      ...getProducts('stay'),
    ],
    [],
  )

  const schedule = useMemo(() => {
    const byDay = new Map<string, typeof booking.items>()
    for (const item of booking.items) {
      const day = item.date ?? booking.dates.start
      byDay.set(day, [...(byDay.get(day) ?? []), item])
    }
    return Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [booking.items, booking.dates.start])

  const titleFor = (productId: string, type: string) =>
    catalog.find((product) => product.id === productId)?.title ?? type

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
            Your itinerary
          </div>
          {schedule.length === 0 ? (
            <Card>
              <p className="text-faint text-small">No items confirmed on this booking yet.</p>
            </Card>
          ) : (
            schedule.map(([day, items]) => (
              <Card key={day} className="stack">
                <div className="row-between">
                  <span className="bold text-small">{formatDate(day)}</span>
                  <Badge tone="gold">{items.reduce((sum, item) => sum + item.qty, 0)} {items.length === 1 ? 'guest' : 'guests'}</Badge>
                </div>
                {items.map((item) => (
                  <div key={`${item.productId}-${item.date}`} className="row-between">
                    <span className="text-small">{titleFor(item.productId, item.type)}</span>
                    <span className="text-faint text-xs">× {item.qty}</span>
                  </div>
                ))}
              </Card>
            ))
          )}
        </section>

        <section className="grid-2">
          <Link to="/trips/$bookingId/itinerary" params={{ bookingId: booking.id }} className="btn btn-outline btn-block">
            Full itinerary
          </Link>
          <Link to="/trips/$bookingId/ticket" params={{ bookingId: booking.id }} className="btn btn-outline btn-block">
            Offline Ticket
          </Link>
        </section>

        <Link to="/trips/$bookingId/support" params={{ bookingId: booking.id }} className="btn btn-ghost btn-block">
          Emergency Support
        </Link>
      </div>
    </div>
  )
}
