import { useMemo, useState } from 'react'
import { Badge, Card, EmptyState } from '@/components/ui'
import { mockPlaces, mockTimeline } from '@/lib/mock'

const PLACE_NAME = (id: string) => mockPlaces.find((p) => p.id === id)?.name

/** A09 — Timeline management. Searchable, filterable. Wireframe spec §35. */
export function AdminTimelinePage() {
  const [query, setQuery] = useState('')
  const [placeId, setPlaceId] = useState('all')
  const [status, setStatus] = useState('all')

  const placeIds = useMemo(() => Array.from(new Set(mockTimeline.map((e) => e.placeId))), [])
  const statuses = useMemo(() => Array.from(new Set(mockTimeline.map((e) => e.status))), [])

  const rows = mockTimeline.filter((e) => {
    const matchesQuery =
      !query ||
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      String(e.year).includes(query.toLowerCase())
    const matchesPlace = placeId === 'all' || e.placeId === placeId
    const matchesStatus = status === 'all' || e.status === status
    return matchesQuery && matchesPlace && matchesStatus
  })

  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Timeline</h1>
        <input
          className="input"
          placeholder="Search place / year…"
          style={{ maxWidth: 260 }}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search timeline entries"
        />
      </div>

      <div className="row wrap">
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={placeId}
          onChange={(event) => setPlaceId(event.target.value)}
          aria-label="Filter by place"
        >
          <option value="all">All places</option>
          {placeIds.map((id) => (
            <option key={id} value={id}>{PLACE_NAME(id)}</option>
          ))}
        </select>
        <select
          className="select"
          style={{ maxWidth: 160 }}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
          {rows.map((e) => (
            <tr key={e.id}>
              <td className="bold">{e.year}</td>
              <td>{e.title}</td>
              <td>{PLACE_NAME(e.placeId)}</td>
              <td>{e.sourceBacked ? <Badge tone="info">Source-backed</Badge> : <Badge tone="gold">Traveler</Badge>}</td>
              <td>
                <Badge tone="success">{e.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 ? (
        <EmptyState icon="◔" title="No matching entries" description="Adjust the search or filters to see more timeline entries." />
      ) : null}

      <Card>
        <span className="eyebrow">Timeline entry detail</span>
        <p className="text-faint text-xs" style={{ margin: 0 }}>
          Event, date range, description, sources, AI model, created by, reviewed by, publication status and related pins live here.
        </p>
      </Card>
    </div>
  )
}
