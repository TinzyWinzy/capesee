import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui'

const KPIS = [
  ['Revenue', 'R28,450'],
  ['Bookings', '24'],
  ['Travelers', '61'],
  ['Pins', '17'],
] as const

/** A01 — Admin dashboard. Wireframe spec §27. */
export function AdminDashboardPage() {
  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Today</h1>
        <span className="text-faint text-small">Linda Moyo ▼</span>
      </div>

      <div className="grid-2">
        {KPIS.map(([label, value]) => (
          <Card key={label} style={{ padding: 18 }}>
            <div className="eyebrow">{label}</div>
            <div className="bold" style={{ fontSize: 24, marginTop: 4 }}>
              {value}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="eyebrow">Booking Activity</div>
        <div className="media ratio-16-9" style={{ marginTop: 10, borderRadius: 8 }}>
          <span className="text-faint text-xs">Chart placeholder — analytics service in Sprint 5</span>
        </div>
      </Card>

      <Card>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Pending actions
        </div>
        <div className="stack" style={{ gap: 6 }}>
          <Link to="/admin/discoveries" className="row-between">
            <span className="text-small">7 discoveries awaiting review</span>
            <span className="text-faint">→</span>
          </Link>
          <Link to="/admin/harvest" className="row-between">
            <span className="text-small">4 AI timeline entries awaiting approval</span>
            <span className="text-faint">→</span>
          </Link>
          <Link to="/admin/bookings" className="row-between">
            <span className="text-small">2 bookings need guide assignment</span>
            <span className="text-faint">→</span>
          </Link>
        </div>
      </Card>
    </div>
  )
}
