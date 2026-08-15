import { Badge, Card } from '@/components/ui'
import { mockTimeline } from '@/lib/mock'

/** A09 — Timeline management. Wireframe spec §35. */
export function AdminTimelinePage() {
  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Timeline</h1>
        <input className="input" placeholder="Search place / year…" style={{ maxWidth: 260 }} />
      </div>

      <div className="row wrap">
        <select className="select" style={{ maxWidth: 160 }}>
          <option>All places</option>
          <option>Castle of Good Hope</option>
        </select>
        <select className="select" style={{ maxWidth: 160 }}>
          <option>All statuses</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Event</th>
            <th>Place</th>
            <th>Source</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockTimeline.map((e) => (
            <tr key={e.id}>
              <td className="bold">{e.year}</td>
              <td>{e.title}</td>
              <td>{e.placeId === 'p-castle' ? 'Castle of Good Hope' : '—'}</td>
              <td>{e.sourceBacked ? <Badge tone="info">Source-backed</Badge> : <Badge tone="gold">Traveler</Badge>}</td>
              <td>
                <Badge tone="success">{e.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Card>
        <span className="eyebrow">Timeline entry detail</span>
        <p className="text-faint text-xs" style={{ margin: 0 }}>
          Event, date range, description, sources, AI model, created by, reviewed by, publication status and related pins live here.
        </p>
      </Card>
    </div>
  )
}
