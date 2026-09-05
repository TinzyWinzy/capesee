import { useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Badge, Button, Card, EmptyState, PlaceholderPage } from '@/components/ui'
import { getPlaces, createPlace, uploadPlaceCover } from '@/modules/places/api/places'

/** A04 — Admin places list. Searchable, filterable. Wireframe spec §30. */
export function AdminPlacesPage() {
  const places = getPlaces()
  const [query, setQuery] = useState('')
  const [regionSlug, setRegionSlug] = useState('all')
  const [type, setType] = useState('all')

  const regions = useMemo(
    () =>
      Array.from(new Set(places.map((p) => p.regionSlug)))
        .map((slug) => ({ slug, name: slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') })),
    [places],
  )
  const types = useMemo(() => Array.from(new Set(places.map((p) => p.type))), [places])

  const rows = places.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase())
    const matchesRegion = regionSlug === 'all' || p.regionSlug === regionSlug
    const matchesType = type === 'all' || p.type === type
    return matchesQuery && matchesRegion && matchesType
  })

  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Places</h1>
        <Link to="/admin/places/new" className="btn btn-primary btn-sm">
          + Add Place
        </Link>
      </div>

      <div className="row wrap">
        <input
          className="input"
          placeholder="Search…"
          style={{ maxWidth: 260 }}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search places"
        />
        <select
          className="select"
          style={{ maxWidth: 160 }}
          value={regionSlug}
          onChange={(event) => setRegionSlug(event.target.value)}
          aria-label="Filter by region"
        >
          <option value="all">All regions</option>
          {regions.map((region) => (
            <option key={region.slug} value={region.slug}>{region.name}</option>
          ))}
        </select>
        <select
          className="select"
          style={{ maxWidth: 160 }}
          value={type}
          onChange={(event) => setType(event.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
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
          {rows.map((p) => (
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

      {rows.length === 0 ? (
        <EmptyState icon="▦" title="No matching places" description="Adjust the search or filters." />
      ) : null}
    </div>
  )
}

/** A05 — Place editor overview. Wireframe spec §31. */
export function AdminPlaceEditorPage({ placeId }: { placeId?: string }) {
  const place = placeId ? getPlaces().find((p) => p.id === placeId) : undefined
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [regionSlug, setRegionSlug] = useState('western-cape')
  const [placeType, setPlaceType] = useState('Historical Site')
  const [locationName, setLocationName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [description, setDescription] = useState('')
  const [summary, setSummary] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (placeId && !place) return <PlaceholderPage title="Unknown place" description={`No place with id ${placeId}.`} />

  const savePlace = async () => {
    setError(null)
    if (!name || !slug || !locationName || !lat || !lng || !description) { setError('Name, slug, location, coordinates and description are required'); return }
    const latitude = Number(lat), longitude = Number(lng)
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) { setError('Latitude/longitude must be numbers'); return }
    setBusy(true)
    try {
      let coverUrl: string | null = null
      if (coverFile) coverUrl = await uploadPlaceCover(coverFile)
      const id = await createPlace({ name, slug: slug.toLowerCase(), regionSlug, place_type: placeType, location_name: locationName, latitude, longitude, description, summary: summary || description.slice(0,120), cover_url: coverUrl })
      navigate({ to: '/admin/places/$placeId', params: { placeId: id } })
    } catch (e) { setError(String((e as Error).message)) } finally { setBusy(false) }
  }

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
          <span className="eyebrow">Overview — new place will be draft, add via Supabase Storage</span>
          {error ? <p className="alert alert-error" role="alert">{error}</p> : null}
          <div className="grid-2">
            <label>
              <span className="label">Name *</span>
              <input className="input" value={name} onChange={e => { setName(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')) }} placeholder="Castle of Good Hope" />
            </label>
            <label>
              <span className="label">Slug *</span>
              <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="castle-of-good-hope" />
            </label>
          </div>
          <div className="grid-2">
            <label>
              <span className="label">Region *</span>
              <select className="select" value={regionSlug} onChange={e => setRegionSlug(e.target.value)}>
                <option value="western-cape">Western Cape</option>
              </select>
            </label>
            <label>
              <span className="label">Type *</span>
              <select className="select" value={placeType} onChange={e => setPlaceType(e.target.value)}>
                <option>Historical Site</option><option>Nature</option><option>Town & Wine Region</option><option>Coastal Town</option>
              </select>
            </label>
          </div>
          <label>
            <span className="label">Location name *</span>
            <input className="input" value={locationName} onChange={e => setLocationName(e.target.value)} placeholder="Cape Town" />
          </label>
          <label>
            <span className="label">Coordinates *</span>
            <div className="grid-2">
              <input className="input" placeholder="Latitude e.g. -33.9259" value={lat} onChange={e => setLat(e.target.value)} />
              <input className="input" placeholder="Longitude e.g. 18.4277" value={lng} onChange={e => setLng(e.target.value)} />
            </div>
          </label>
          <label>
            <span className="label">Summary (120 chars)</span>
            <input className="input" value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short summary for cards" />
          </label>
          <label>
            <span className="label">Description *</span>
            <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Full description — source-backed history" />
          </label>
          <label>
            <span className="label">Cover image (upload to place-media bucket)</span>
            <input className="input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] ?? null)} />
          </label>
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="outline" onClick={() => navigate({ to: '/admin/places' })}>Cancel</Button>
            <Button variant="primary" onClick={savePlace} disabled={busy}>{busy ? 'Saving…' : 'Create draft'}</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
