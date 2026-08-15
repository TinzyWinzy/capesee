import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, LocationPicker, UploadMedia } from '@/components/ui'
import { PIN_CATEGORIES } from '@/lib/constants'
import { useOnline } from '@/hooks/useOnline'
import { enqueueAction, isOnline } from '@/services/offline'
import { publishPin } from '@/modules/journal/api/journal'

/** T07 — Create discovery. Must be extremely easy. Wireframe spec §9. */
export function CreateDiscoveryPage() {
  const navigate = useNavigate()
  const online = useOnline()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<(typeof PIN_CATEGORIES)[number]>('Wildlife')
  const [photo, setPhoto] = useState<string | undefined>()
  const [mediaFile, setMediaFile] = useState<File>()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const publish = async () => {
    setError(undefined)
    if (online) {
      setBusy(true)
      try {
        await publishPin({
          authorName: 'Traveler',
          title: title || 'Untitled discovery',
          description,
          category,
          coordinates: { lat: -33.92, lng: 18.42 },
          photoUrl: undefined,
          likes: 0,
          comments: 0,
          placeId: undefined,
        }, mediaFile)
        navigate({ to: '/journal' })
      } catch (publishError) {
        setError(publishError instanceof Error ? publishError.message : 'Discovery could not be published.')
      } finally {
        setBusy(false)
      }
    } else {
      enqueueAction({
        id: `pin-${Date.now()}`,
        kind: 'publish-pin',
        payload: {
          id: `pin-${Date.now()}`,
          authorName: 'Tinotenda',
          title,
          description,
          category,
          coordinates: { lat: -33.92, lng: 18.42 },
          createdAt: new Date().toISOString(),
          status: 'draft',
          photoUrl: undefined,
          likes: 0,
          comments: 0,
          placeId: undefined,
        },
      })
      setSaved(true)
    }
  }

  return (
    <div className="page-narrow">
      <div className="row-between" style={{ marginBottom: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate({ to: '/journal' })}>
          Cancel
        </button>
        <h1 className="section-title">Add Discovery</h1>
        <span style={{ width: 60 }} />
      </div>

      {!isOnline() ? <div className="offline-banner" style={{ marginBottom: 12 }}>Saved offline — uploads when you reconnect</div> : null}

      <div className="stack">
        <UploadMedia
          preview={photo}
          disabled={busy}
          onFile={(file) => {
            if (photo?.startsWith('blob:')) URL.revokeObjectURL(photo)
            setMediaFile(file ?? undefined)
            setPhoto(file ? URL.createObjectURL(file) : undefined)
          }}
        />

        <label>
          <span className="label">What did you discover?</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Rare bird near the monument" />
        </label>

        <label>
          <span className="label">Tell us more</span>
          <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <section>
          <span className="label">Location</span>
          <LocationPicker />
        </section>

        <section>
          <span className="label">Category</span>
          <div className="row wrap">
            {PIN_CATEGORIES.map((c) => (
              <button key={c} className={category === c ? 'chip chip-active' : 'chip'} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="row-between">
          <span className="label" style={{ marginBottom: 0 }}>
            When?
          </span>
          <button className="chip chip-active">Now ▾</button>
        </section>

        {saved ? (
          <div className="card">
            <div className="bold text-small">Discovery saved.</div>
            <p className="text-faint text-xs">We'll publish it when you're back online.</p>
          </div>
        ) : (
          <Button variant="primary" size="lg" block onClick={() => void publish()} disabled={busy || !title.trim()}>
            {busy ? 'Publishing…' : 'Publish Discovery'}
          </Button>
        )}
        {error ? <div className="error-box" role="alert">{error}</div> : null}
      </div>
    </div>
  )
}
