import { useState } from 'react'
import { EmptyState, TripCard } from '@/components/ui'
import { getMyBookings } from '@/modules/bookings/api/orders'

/** T14 — Trips home. Upcoming | Past tabs. Wireframe spec §16. */
export function TripsHomePage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const bookings = getMyBookings()
  const visible = bookings.filter((b) => (tab === 'upcoming' ? b.status !== 'completed' : b.status === 'completed'))

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ fontSize: 20, marginBottom: 14 }}>
        My Trips
      </h1>
      <div className="row wrap" style={{ marginBottom: 14 }}>
        {(
          [
            ['upcoming', 'Upcoming'],
            ['past', 'Past'],
          ] as const
        ).map(([key, label]) => (
          <button key={key} className={tab === key ? 'chip chip-active' : 'chip'} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="✈"
          title={tab === 'upcoming' ? 'No upcoming trips' : 'No past trips yet'}
          description="Your bookings will appear here. Everything works offline once cached."
        />
      ) : (
        <div className="stack">
          {visible.map((b) => (
            <TripCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}
