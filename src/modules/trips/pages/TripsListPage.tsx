import { EmptyState, TripCard } from '@/components/ui'
import { getMyBookings } from '@/modules/bookings/api/orders'

/** Upcoming or past trips list (tabbed views off /trips). */
export function TripsListPage({ mode }: { mode: 'upcoming' | 'past' }) {
  const visible = getMyBookings().filter((b) => (mode === 'upcoming' ? b.status !== 'completed' : b.status === 'completed'))

  if (visible.length === 0) {
    return (
      <EmptyState
        icon="✈"
        title={mode === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
        description="Book a Cape experience to fill this list."
      />
    )
  }

  return (
    <div className="page-narrow stack">
      {visible.map((b) => (
        <TripCard key={b.id} booking={b} />
      ))}
    </div>
  )
}
