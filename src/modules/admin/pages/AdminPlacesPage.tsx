import { Link } from '@tanstack/react-router'
import { Badge, Card, PlaceholderPage } from '@/components/ui'
import { getPlaces } from '@/modules/places/api/places'

/** A04 — Admin places list. Wireframe spec §30. */
export function AdminPlacesPage() {
  const places = getPlaces()
  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Places</h1>
        <Link to="/admin/places/new" className="btn btn-primary btn-sm">
          + Add Place
        </Link>
      </div>

      <div className="row wrap">
        <input className="input" placeholder="Search…" style={{ maxWidth: 260 }} />
        <select className="select" style={{ maxWidth: 160 }}>
          <option>All regions</option>
          <option>Western Cape</option>
        </select>
        <select className="select" style={{ maxWidth: 160 }}>
          <option>All types</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Timeline</th>
            <th>Pins</th>
          </tr>
        </thead>
        <tbody>
          {places.map((p) => (
            <tr key={p.id}>
              <td>
                <Link to="/admin/places/$placeId" params={{ placeId: p.id }} className="bold text-small">
                  {p.name}
                </Link>{' '}
                {p.verified ? <Badge tone="success">✓</Badge> : null}
              </td>
              <td>{p.type}</td>
              <td>{p.timelineCount}</td>
              <td>{p.pinCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** A05 — Place editor overview. Wireframe spec §31. */
export function AdminPlaceEditorPage({ placeId }: { placeId?: string }) {
  const place = placeId ? getPlaces().find((p) => p.id === placeId) : undefined

  if (placeId && !place) return <PlaceholderPage title="Unknown place" description={`No place with id ${placeId}.`} />

  return (
    <div className="stack">
      <div className="row">
        <Link to="/admin/places" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">{place?.name ?? 'New Place'}</h1>
        {place?.verified ? <Badge tone="success">Verified ✓</Badge> : null}
      </div>

      {place ? (
        <>
          <div className="grid-2">
            <Card className="stack">
              <span className="eyebrow">Location</span>
              <span className="text-small bold">{place.locationName}</span>
              <span className="text-faint text-xs">
                {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
              </span>
            </Card>
            <Card className="stack">
              <span className="eyebrow">Description</span>
              <span className="text-small">{place.description}</span>
            </Card>
            <Card className="stack">
              <span className="eyebrow">Linked sources</span>
              <span className="bold">{place.sourceCount}</span>
            </Card>
            <Card className="stack">
              <span className="eyebrow">Timeline events</span>
              <span className="bold">{place.timelineCount}</span>
            </Card>
            <Card className="stack">
              <span className="eyebrow">Traveler discoveries</span>
              <span className="bold">{place.pinCount}</span>
            </Card>
            <Card className="stack">
              <span className="eyebrow">Experiences</span>
              <span className="bold">{place.experienceCount}</span>
            </Card>
          </div>
          <Link to="/discover/places/$placeSlug" params={{ placeSlug: place.slug }} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
            View Public Page
          </Link>
        </>
      ) : (
        <Card className="stack">
          <span className="eyebrow">Overview</span>
          <label>
            <span className="label">Name</span>
            <input className="input" />
          </label>
          <label>
            <span className="label">Coordinates</span>
            <div className="grid-2">
              <input className="input" placeholder="Latitude" />
              <input className="input" placeholder="Longitude" />
            </div>
          </label>
          <label>
            <span className="label">Description</span>
            <textarea className="textarea" />
          </label>
        </Card>
      )}
    </div>
  )
}
