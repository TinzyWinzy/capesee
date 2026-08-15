import { useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import type { Place } from '@/types'
import { RatingDisplay, VerificationBadge } from '@/components/ui'

const PLACE_TABS = [
  ['Overview', ''],
  ['Timeline', '/timeline'],
  ['Discoveries', '/discoveries'],
  ['Experiences', '/experiences'],
  ['Media', '/media'],
] as const

/** Place detail shell (T05): a calm field-guide header, actions, and persistent tabs. */
export function PlaceHeader({ place }: { place: Place }) {
  const [saved, setSaved] = useState(false)
  const [shareLabel, setShareLabel] = useState('Share')
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`

  const sharePlace = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text: place.description, url: window.location.href })
        return
      }
      await navigator.clipboard?.writeText(window.location.href)
      setShareLabel('Link copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareLabel('Unable to share')
    }
  }

  return (
    <main className="place-shell">
      <section className="place-hero">
        {place.coverUrl ? (
          <img className="place-hero-image" src={place.coverUrl} alt={`${place.name} in ${place.locationName}`} />
        ) : (
          <div className="place-hero-illustration" role="img" aria-label={`Illustrated site plan for ${place.name}`}>
            <div className="fort-plan" aria-hidden>
              <span /><span /><span /><span /><span />
            </div>
            <div className="place-coordinate-label" aria-hidden>
              {Math.abs(place.coordinates.lat).toFixed(3)}° S · {place.coordinates.lng.toFixed(3)}° E
            </div>
          </div>
        )}

        <div className="place-hero-toolbar">
          <Link to="/discover/map" className="place-round-action" aria-label="Back to map">←</Link>
          <div className="row">
            <button type="button" className={saved ? 'place-round-action is-active' : 'place-round-action'} onClick={() => setSaved((value) => !value)} aria-pressed={saved} aria-label={saved ? 'Remove from saved places' : 'Save place'}>
              {saved ? '♥' : '♡'}
            </button>
            <button type="button" className="place-text-action" onClick={sharePlace}>{shareLabel}</button>
          </div>
        </div>

        <div className="place-hero-caption">
          <div className="place-title-block">
            <p className="eyebrow">{place.locationName} · {place.type}</p>
            <h1>{place.name}</h1>
          </div>
          <div className="place-hero-proof">
            {place.verified ? <VerificationBadge /> : null}
            <RatingDisplay rating={place.rating} />
          </div>
        </div>
      </section>

      <div className="place-command-bar">
        <div className="place-actions">
          <a className="btn btn-ink" href={directionsUrl} target="_blank" rel="noreferrer">Directions <span aria-hidden>↗</span></a>
          <button type="button" className="btn btn-outline" onClick={() => setSaved((value) => !value)}>{saved ? 'Saved' : 'Save place'}</button>
          <Link to="/journal/create" className="btn btn-primary">Add discovery</Link>
        </div>
        <div className="place-quick-facts" aria-label="Place summary">
          <span><strong>{place.timelineCount}</strong> historical moments</span>
          <span><strong>{place.pinCount}</strong> traveler discoveries</span>
          <span><strong>{place.experienceCount}</strong> experiences</span>
        </div>
      </div>

      <nav className="place-tabs" aria-label="Place sections">
        {PLACE_TABS.map(([label, suffix]) => (
          <Link
            key={label}
            to={`/discover/places/$placeSlug${suffix}`}
            params={{ placeSlug: place.slug }}
            activeOptions={{ exact: suffix === '' }}
            activeProps={{ className: 'is-active' }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="place-content">
        <Outlet />
      </div>
    </main>
  )
}
