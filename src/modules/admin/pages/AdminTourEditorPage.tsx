import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Badge, Button, Card } from '@/components/ui'
import { AdminInventoryPanel } from '@/modules/admin/components/AdminInventoryPanel'
import { createProduct, getProducts, updateProduct, uploadProductCover } from '@/modules/bookings/api/products'

interface ItineraryStop {
  key: number
  place: string
  arrival: string
  duration: string
}

let stopSeq = 0

/**
 * A03 — Tour editor. Key rule: tour stops select a PLACE, not isolated
 * geographic coordinates (spec §29). Save mutates the live product when
 * editing; product creation for brand-new tours lands with Sprint 4.
 */
export function AdminTourEditorPage({ tourId }: { tourId?: string }) {
  const isEdit = Boolean(tourId && tourId !== 'new')
  const existing = isEdit ? getProducts('tour').find((t) => t.id === tourId) : undefined
  const navigate = useNavigate()

  const [title, setTitle] = useState(existing?.title ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(existing ? String(existing.price) : '')
  const [duration, setDuration] = useState(existing?.durationHours ? String(existing.durationHours) : '8')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [stops, setStops] = useState<ItineraryStop[]>([{ key: stopSeq++, place: '', arrival: '', duration: '' }])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string>()

  const addStop = () => setStops((current) => [...current, { key: stopSeq++, place: '', arrival: '', duration: '' }])
  const updateStop = (key: number, patch: Partial<ItineraryStop>) =>
    setStops((current) => current.map((stop) => (stop.key === key ? { ...stop, ...patch } : stop)))

  const save = async (nextStatus: 'draft' | 'published') => {
    if (!title || !price) { setStatus('error'); setError('Title and price required'); return }
    const slugFinal = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')) as string
    setBusy(true)
    setStatus('idle')
    try {
      let coverUrl: string | undefined
      if (coverFile) coverUrl = await uploadProductCover(coverFile)
      if (isEdit) {
        await updateProduct(tourId as string, {
          title,
          description,
          price: Number(price),
          status: nextStatus === 'published' ? 'published' : 'draft',
        })
        if (coverUrl) await updateProduct(tourId as string, { cover_url: coverUrl } as never)
        setStatus('saved')
      } else {
        const id = await createProduct({
          title,
          slug: slugFinal,
          description: description || title,
          price: Number(price),
          product_type: 'tour',
          duration_hours: duration ? Number(duration) : null,
        })
        if (coverUrl) await updateProduct(id, { cover_url: coverUrl } as never)
        // optionally set status
        if (nextStatus === 'published') await updateProduct(id, { status: 'published' })
        setStatus('saved')
        navigate({ to: '/admin/tours/$tourId', params: { tourId: id } })
      }
    } catch (saveError) {
      setStatus('error')
      setError(saveError instanceof Error ? saveError.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack">
      <div className="row">
        <Link to="/admin/tours" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">{isEdit ? 'Edit Tour' : 'Create Tour'}</h1>
        {existing ? <Badge tone="success">Published</Badge> : null}
      </div>

      {status === 'saved' ? <p className="alert alert-success" role="status">Tour saved.</p> : null}
      {status === 'error' ? <p className="alert alert-error" role="alert">{error}</p> : null}

      <Card className="stack">
        <span className="eyebrow">Basic Information</span>
        <div className="grid-2">
          <label>
            <span className="label">Title *</span>
            <input className="input" placeholder="Stellenbosch Wine Experience" value={title} onChange={(event) => { setTitle(event.target.value); if (!isEdit && !slug) setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')) }} />
          </label>
          <label>
            <span className="label">Slug *</span>
            <input className="input" placeholder="stellenbosch-wine-experience" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
        </div>
        <div className="grid-2">
          <label>
            <span className="label">Region</span>
            <select className="select" defaultValue="Western Cape">
              <option>Western Cape</option>
              <option>Eastern Cape</option>
            </select>
          </label>
          <label>
            <span className="label">Duration (hours)</span>
            <input className="input" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="8" />
          </label>
        </div>
        <label>
          <span className="label">Description</span>
          <textarea className="textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Guided day shaped by the places along the way." />
        </label>
        <label>
          <span className="label">Cover image</span>
          <input className="input" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
        </label>
      </Card>

      <Card className="stack">
        <span className="eyebrow">Pricing</span>
        <div className="grid-2">
          <label>
            <span className="label">Adult (ZAR)</span>
            <input className="input" type="number" placeholder="1250" value={price} onChange={(event) => setPrice(event.target.value)} />
          </label>
          <label>
            <span className="label">Child (ZAR)</span>
            <input className="input" type="number" placeholder="850" />
          </label>
        </div>
      </Card>

      {!isEdit ? (
        <Card className="stack">
          <span className="eyebrow">Availability</span>
          <div className="grid-2">
            <label>
              <span className="label">Dates</span>
              <input className="input" placeholder="14–17 Aug" />
            </label>
            <label>
              <span className="label">Capacity</span>
              <input className="input" type="number" placeholder="12" />
            </label>
          </div>
        </Card>
      ) : (
        <AdminInventoryPanel productId={tourId as string} />
      )}

      <Card className="stack">
        <div className="row-between">
          <span className="eyebrow">Itinerary</span>
          <Button variant="outline" size="sm" onClick={addStop}>
            + Add stop
          </Button>
        </div>
        {stops.map((stop, index) => (
          <div key={stop.key} className="card">
            <span className="label">STOP {index + 1}</span>
            <input
              className="input"
              placeholder="Search / Create Place — e.g. Stellenbosch wine estate"
              style={{ marginBottom: 8 }}
              value={stop.place}
              onChange={(event) => updateStop(stop.key, { place: event.target.value })}
            />
            <div className="grid-2">
              <input className="input" placeholder="Arrival time" value={stop.arrival} onChange={(event) => updateStop(stop.key, { arrival: event.target.value })} />
              <input className="input" placeholder="Duration" value={stop.duration} onChange={(event) => updateStop(stop.key, { duration: event.target.value })} />
            </div>
            <p className="text-faint text-xs" style={{ marginTop: 8 }}>
              Stops must link to a PLACE so timeline and discoveries enrich each tour.
            </p>
          </div>
        ))}
      </Card>

      <div className="row">
        <Button variant="outline" disabled={busy} onClick={() => void save('draft')}>
          {busy ? 'Saving…' : 'Save Draft'}
        </Button>
        <Button variant="primary" disabled={busy} onClick={() => void save('published')}>
          {busy ? 'Saving…' : isEdit ? 'Publish' : 'Create & Publish'}
        </Button>
      </div>
    </div>
  )
}
