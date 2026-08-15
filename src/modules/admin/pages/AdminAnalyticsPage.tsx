import { Card, EmptyState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { formatRand } from '@/lib/format'
import { fetchAdminStats } from '@/modules/admin/api/admin'

/** A10 — Analytics. Revenue group wired to live bookings; engagement/conversion require analytics events. Spec §36. */
export function AdminAnalyticsPage() {
  const { data: stats, error, loading } = useAsyncData(() => fetchAdminStats(), [])

  const revenueMetrics = stats
    ? [
        ['Bookings', String(stats.bookings)],
        ['GMV', formatRand(stats.gmv)],
        ['Net revenue', formatRand(stats.revenue)],
        [
          'Average booking value',
          stats.bookings > 0 ? formatRand(Math.round(stats.gmv / stats.bookings)) : '—',
        ],
        [
          'Cancellation rate',
          stats.gmv > 0 ? `${Math.round((stats.cancelledBookings / stats.bookings) * 100)}%` : '—',
        ],
      ]
    : []

  return (
    <div className="stack">
      <h1 className="section-title">Analytics</h1>

      {loading ? <SkeletonCard lines={3} /> : null}
      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}

      {!loading && !error && stats ? (
        <Card className="stack">
          <span className="eyebrow">Revenue</span>
          {revenueMetrics.map(([m, v]) => (
            <div key={m} className="row-between">
              <span className="text-small">{m}</span>
              <span className="bold text-small">{v}</span>
            </div>
          ))}
        </Card>
      ) : null}

      {!loading && !error && !stats ? (
        <EmptyState
          icon="▥"
          title="Live data requires Supabase"
          description="Revenue metrics come from the bookings table once Supabase is configured."
        />
      ) : null}

      {(
        [
          ['Destination engagement', ['Map sessions', 'Place views', 'Pins created', 'Timeline interactions', 'Search-to-place conversion']],
          ['Conversion', ['Place → Experience', 'Experience → Cart', 'Cart → Checkout', 'Checkout → Booking']],
        ] as const
      ).map(([group, metrics]) => (
        <Card key={group} className="stack">
          <span className="eyebrow">{group}</span>
          {metrics.map((m) => (
            <div key={m} className="row-between">
              <span className="text-small">{m}</span>
              <span className="text-faint text-small">—</span>
            </div>
          ))}
          <p className="text-faint text-xs" style={{ margin: 0 }}>
            Requires analytics event capture (Sprint 5).
          </p>
        </Card>
      ))}

      <Card className="stack">
        <span className="eyebrow">Headline metric</span>
        <div className="row-between">
          <span className="bold text-small">DISCOVERY-ASSISTED BOOKING RATE</span>
          <span className="badge badge-gold">Not tracked yet</span>
        </div>
        <p className="text-faint text-xs" style={{ margin: 0 }}>
          Bookings that followed a discovery, place timeline or map interaction. This is the metric that proves the discovery layer drives commerce.
        </p>
      </Card>
    </div>
  )
}
