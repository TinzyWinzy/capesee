import { Link } from '@tanstack/react-router'
import { Card, EmptyState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { formatRand } from '@/lib/format'
import { fetchAdminStats } from '@/modules/admin/api/admin'
import { useAuthStore } from '@/stores/auth'

/** A01 — Admin dashboard. Real operational counts. Wireframe spec §27. */
export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, error, loading } = useAsyncData(() => fetchAdminStats(), [])

  const kpis = stats
    ? [
        ['Revenue', formatRand(stats.revenue)],
        ['Bookings', String(stats.bookings)],
        ['Travelers', String(stats.travelers)],
        ['Discoveries', String(stats.pins)],
      ]
    : []

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1 className="section-title">Today</h1>
          <p className="text-faint text-small" style={{ margin: 0 }}>
            {user?.fullName ?? 'Admin'} · Capesee operations
          </p>
        </div>
        <Link to="/admin/payments" className="btn btn-outline btn-sm">Payment ledger</Link>
      </div>

      {loading ? <SkeletonCard lines={2} /> : null}
      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}
      {!loading && !error && stats ? (
        <>
          <div className="grid-2">
            {kpis.map(([label, value]) => (
              <Card key={label} style={{ padding: 18 }}>
                <div className="eyebrow">{label}</div>
                <div className="bold" style={{ fontSize: 24, marginTop: 4 }}>{value}</div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="eyebrow">Booking activity</div>
            <p className="text-faint text-small" style={{ marginTop: 8 }}>
              {stats.bookings} total bookings · {stats.unassignedBookings} awaiting guide assignment
            </p>
          </Card>

          <Card>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Pending actions</div>
            {stats.pendingDiscoveries === 0 && stats.unassignedBookings === 0 ? (
              <p className="text-faint text-small" style={{ margin: 0 }}>Queue clear — nothing needs attention.</p>
            ) : (
              <div className="stack" style={{ gap: 6 }}>
                {stats.pendingDiscoveries > 0 ? (
                  <Link to="/admin/discoveries" className="row-between">
                    <span className="text-small">{stats.pendingDiscoveries} discoveries awaiting review</span>
                    <span className="text-faint">→</span>
                  </Link>
                ) : null}
                {stats.unassignedBookings > 0 ? (
                  <Link to="/admin/bookings" className="row-between">
                    <span className="text-small">{stats.unassignedBookings} bookings need guide assignment</span>
                    <span className="text-faint">→</span>
                  </Link>
                ) : null}
              </div>
            )}
          </Card>
        </>
      ) : null}

      {!loading && !error && !stats ? (
        <EmptyState
          icon="▦"
          title="Live data requires Supabase"
          description="Configure Supabase credentials to surface real operational counts."
        />
      ) : null}
    </div>
  )
}
