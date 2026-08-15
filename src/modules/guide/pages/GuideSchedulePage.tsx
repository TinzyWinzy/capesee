import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Badge, Card, EmptyState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchGuideAssignments } from '@/modules/guide/api/guide'

const dayFormatter = new Intl.DateTimeFormat('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
const hourFormatter = new Intl.DateTimeFormat('en-ZA', { hour: '2-digit', minute: '2-digit' })

/** Guide weekly schedule — next 7 days from real assignments. */
export function GuideSchedulePage() {
  const [from] = useState(() => new Date())
  const { data: assignments, error, loading } = useAsyncData(() => fetchGuideAssignments(from), [from])

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(from.getDate() + index)
    return date
  })

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>Schedule</h1>

      {loading ? <SkeletonCard lines={5} /> : null}
      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}
      {!loading && !error && (assignments ?? []).length === 0 ? (
        <EmptyState icon="▦" title="No upcoming assignments" description="Bookings assigned to you will appear here with their service dates." />
      ) : null}
      {!loading && !error && assignments && assignments.length > 0 ? (
        <div className="stack">
          {days.map((date) => {
            const rows = assignments.filter((a) => new Date(a.startsAt).toDateString() === date.toDateString())
            return (
              <Card key={date.toISOString()}>
                <div className="row-between" style={{ marginBottom: rows.length ? 10 : 0 }}>
                  <span className="bold text-small">{dayFormatter.format(date)}</span>
                  <Badge tone={rows.length ? 'accent' : 'default'}>{rows.length} {rows.length === 1 ? 'job' : 'jobs'}</Badge>
                </div>
                {rows.map((assignment) => (
                  <Link
                    key={assignment.id}
                    to="/guide/booking/$bookingId"
                    params={{ bookingId: assignment.id }}
                    className="row-between"
                    style={{ padding: '8px 0', borderTop: '1px solid var(--color-line)' }}
                  >
                    <span className="text-small">
                      {hourFormatter.format(new Date(assignment.startsAt))} · {assignment.items.map((item) => item.type).join(', ')}
                    </span>
                    <span className="text-faint text-xs">{assignment.travelerName} · {assignment.guestCount}</span>
                  </Link>
                ))}
              </Card>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
