import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, EmptyState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { formatDate } from '@/lib/format'
import { useAuthStore } from '@/stores/auth'
import { fetchGuideAssignments } from '@/modules/guide/api/guide'

function greeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const timeFormatter = new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })
const hourFormatter = new Intl.DateTimeFormat('en-ZA', { hour: '2-digit', minute: '2-digit' })

/** G01 — Guide dashboard. Real guide assignments. Wireframe spec §22. */
export function GuideDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [from] = useState(() => new Date())
  const { data: assignments, error, loading } = useAsyncData(() => fetchGuideAssignments(from), [from])

  const todayKey = from.toDateString()
  const today = (assignments ?? []).filter((a) => new Date(a.startsAt).toDateString() === todayKey)
  const upcoming = (assignments ?? []).filter((a) => new Date(a.startsAt).toDateString() !== todayKey).slice(0, 4)

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ fontSize: 20 }}>
        {greeting(new Date().getHours())}, {user?.fullName?.split(' ')[0] ?? 'guide'}
      </h1>
      <p className="text-faint text-small" style={{ marginBottom: 16 }}>
        {timeFormatter.format(new Date())}
      </p>

      <div className="eyebrow" style={{ marginBottom: 8 }}>Today</div>

      {loading ? <SkeletonCard lines={3} /> : null}
      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}
      {!loading && !error && today.length === 0 ? (
        <EmptyState icon="▢" title="No assignments today" description="Bookings assigned to you will appear here on their service date." />
      ) : null}
      {!loading && !error && today.length > 0 ? (
        <div className="stack">
          {today.map((assignment) => (
            <Card key={assignment.id} className="row-between">
              <div className="col" style={{ gap: 2 }}>
                <span className="bold text-small">
                  {hourFormatter.format(new Date(assignment.startsAt))} — {assignment.items.map((item) => item.type).join(', ')}
                </span>
                <span className="text-faint text-xs">
                  {assignment.travelerName} · {assignment.guestCount} {assignment.guestCount === 1 ? 'guest' : 'guests'}
                </span>
              </div>
              <Link to="/guide/booking/$bookingId" params={{ bookingId: assignment.id }} className="btn btn-ink btn-sm">
                Open booking
              </Link>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Coming up</div>
      {!loading && !error && upcoming.length === 0 ? (
        <p className="text-faint text-small">No future assignments yet.</p>
      ) : null}
      {!loading && !error && upcoming.length > 0 ? (
        <div className="stack">
          {upcoming.map((assignment) => (
            <Card key={assignment.id} className="row-between">
              <div className="col" style={{ gap: 2 }}>
                <span className="bold text-small">{formatDate(assignment.startsAt)}</span>
                <span className="text-faint text-xs">
                  {hourFormatter.format(new Date(assignment.startsAt))} · {assignment.items.map((item) => item.type).join(', ')}
                </span>
              </div>
              <Link to="/guide/booking/$bookingId" params={{ bookingId: assignment.id }} className="btn btn-outline btn-sm">
                Open
              </Link>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
