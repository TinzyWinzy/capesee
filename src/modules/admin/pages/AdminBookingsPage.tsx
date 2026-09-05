import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookingCard, EmptyState, SkeletonCard } from '@/components/ui'
import { getAllBookings } from '@/modules/bookings/api/orders'
import { fetchAdminBookings } from '@/modules/admin/api/admin'
import { getSupabase } from '@/services/supabase/client'
import { useAsyncData } from '@/lib/useAsyncData'
import { formatRand } from '@/lib/format'
import { BOOKING_STATUS } from '@/lib/constants'

/** A02 — Admin bookings list. Supabase live with mock fallback. */
export function AdminBookingsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState('')
  const hasSupabase = Boolean(getSupabase())

  const { data: liveRows, loading, error } = useAsyncData(
    () => fetchAdminBookings({ status: filter, query, limit: 50 }),
    [filter, query]
  )

  const fallback = getAllBookings()
    .filter((b) => filter === 'All' || b.status === filter)
    .filter((b) => !query || b.code.toLowerCase().includes(query.toLowerCase()) || (b.travelerName ?? '').toLowerCase().includes(query.toLowerCase()))

  const bookings = hasSupabase ? (liveRows ?? []) : fallback
  const showSkeleton = hasSupabase && loading
  const showEmpty = !showSkeleton && bookings.length === 0

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

      {showSkeleton ? <SkeletonCard lines={3} /> : null}
      {error ? <p className="alert alert-error" role="alert">{String(error.message ?? error)}</p> : null}
      {hasSupabase && !showSkeleton && !error ? (
        showEmpty ? (
          <EmptyState icon="▤" title="No bookings" description="Adjust the status filter or search query." />
        ) : (
          <div className="grid-2">
            {(liveRows ?? []).map((b) => (
              <div key={b.id} className="card card-link" role="button" tabIndex={0} onClick={() => navigate({ to: '/admin/bookings/$bookingId', params: { bookingId: b.id } })} onKeyDown={(e) => e.key === 'Enter' && navigate({ to: '/admin/bookings/$bookingId', params: { bookingId: b.id } })}>
                <div className="row-between">
                  <span className="bold text-small">{b.code}</span>
                  <span className="badge">{b.status}</span>
                </div>
                <div className="text-faint text-xs" style={{ marginTop: 6 }}>{b.travelerName} · {new Date(b.startsAt).toLocaleDateString()} → {new Date(b.endsAt).toLocaleDateString()}</div>
                <div className="bold text-small" style={{ marginTop: 8 }}>{formatRand(b.total)}</div>
                <div className="text-faint text-xs">{b.guideId ? `Guide ${b.guideId.slice(0,8)}` : 'Unassigned'}</div>
              </div>
            ))}
          </div>
        )
      ) : !hasSupabase && !showSkeleton ? (
        showEmpty ? (
          <EmptyState icon="▤" title="No bookings" description="Adjust the status filter or search query." />
        ) : (
          <div className="grid-2">
            {fallback.map((b) => (
              <BookingCard key={b.id} booking={b} onClick={() => navigate({ to: '/admin/bookings/$bookingId', params: { bookingId: b.id } })} />
            ))}
          </div>
        )
      ) : null}
    </div>
  )
}
