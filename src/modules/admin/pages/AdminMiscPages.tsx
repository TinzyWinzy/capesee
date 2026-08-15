import { Link } from '@tanstack/react-router'
import { Badge, Card, PlaceholderPage } from '@/components/ui'
import { getProducts } from '@/modules/bookings/api/products'
import { getPlaces } from '@/modules/places/api/places'
import { getMyBookings } from '@/modules/bookings/api/orders'

/** Admin stays list. */
export function AdminStaysPage() {
  const stays = getProducts('stay')
  return (
    <div className="stack">
      <h1 className="section-title">Stays</h1>
      <div className="grid-2">
        {stays.map((s) => (
          <Card key={s.id} className="row-between">
            <span className="bold text-small">{s.title}</span>
            <Link to="/admin/stays/$stayId" params={{ stayId: s.id }}>
              <button className="btn btn-outline btn-sm">Edit</button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** Admin transfers list. */
export function AdminTransfersPage() {
  const transfers = getProducts('transfer')
  return (
    <div className="stack">
      <h1 className="section-title">Transfers</h1>
      <div className="grid-2">
        {transfers.map((t) => (
          <Card key={t.id} className="row-between">
            <span className="bold text-small">{t.title}</span>
            <button className="btn btn-outline btn-sm">Edit</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** Admin guides list. */
export function AdminGuidesPage() {
  return (
    <div className="stack">
      <h1 className="section-title">Guides</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="bold text-small">Mike K</td>
            <td>guide</td>
            <td>
              <Badge tone="success">Active</Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/** Admin travelers list. */
export function AdminCustomersPage() {
  return (
    <div className="stack">
      <h1 className="section-title">Travelers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bookings</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {getMyBookings().map((b) => (
            <tr key={b.id}>
              <td>
                <Link to="/admin/customers/$customerId" params={{ customerId: b.travelerId }} className="bold text-small">
                  {b.travelerName}
                </Link>
              </td>
              <td>1</td>
              <td>Aug 2026</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Admin media library. */
export function AdminMediaPage() {
  return (
    <div className="stack">
      <h1 className="section-title">Media</h1>
      <div className="grid-3">
        {getPlaces().map((p) => (
          <div key={p.id} className="media ratio-4-3">
            <span className="text-xs">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Admin payments ledger. */
export function AdminPaymentsPage() {
  return <PlaceholderPage title="Payments" description="Payment ledger and refunds." note="§28" />
}

/** Admin settings. */
export function AdminSettingsPage() {
  return <PlaceholderPage title="Settings" description="Platform configuration, users and audit log." note="§26" />
}
