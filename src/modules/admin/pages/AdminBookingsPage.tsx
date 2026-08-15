import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookingCard, EmptyState } from '@/components/ui'
import { getAllBookings } from '@/modules/bookings/api/orders'
import { BOOKING_STATUS } from '@/lib/constants'

/** A02 — Admin bookings list. Searchable, filterable. Wireframe spec §28. */
export function AdminBookingsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState('')

  const bookings = getAllBookings()
    .filter((b) => filter === 'All' || b.status === filter)
    .filter(
      (b) =>
        !query ||
        b.code.toLowerCase().includes(query.toLowerCase()) ||
        (b.travelerName ?? '').toLowerCase().includes(query.toLowerCase()),
    )

  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Bookings</h1>
        <input
          className="input"
          placeholder="Search code or traveler…"
          style={{ maxWidth: 260 }}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search bookings"
        />
      </div>

      <div className="row wrap">
        {['All', ...BOOKING_STATUS].map((s) => (
          <button key={s} className={filter === s ? 'chip chip-active' : 'chip'} onClick={() => setFilter(s)} aria-pressed={filter === s}>
            {s}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon="▤" title="No bookings" description="Adjust the status filter or search query." />
      ) : (
        <div className="grid-2">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} onClick={() => navigate({ to: '/admin/bookings/$bookingId', params: { bookingId: b.id } })} />
          ))}
        </div>
      )}
    </div>
  )
}
