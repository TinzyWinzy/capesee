import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, DiscoveryCard, TourCard } from '@/components/ui'
import { getPlaces } from '@/modules/places/api/places'
import { getProducts } from '@/modules/bookings/api/products'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'

/** Global search — understands entity types. See spec §38. */
export function SearchPage() {
  const { q } = useSearch({ from: '/_app/discover/search' })
  const navigate = useNavigate()
  const [tab, setTab] = useState<'everything' | 'places' | 'experiences' | 'discoveries' | 'history' | 'accommodation'>('everything')

  const query = q ?? ''
  const places = getPlaces().filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  const tours = getProducts('tour').filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
  const stays = getProducts('stay').filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
  const pins = getNearbyDiscoveries().filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
  const history = query ? getPlaces().filter((p) => p.timelineCount > 0) : []

  const filters = [
    ['everything', 'Everything'],
    ['places', 'Places'],
    ['experiences', 'Experiences'],
    ['discoveries', 'Discoveries'],
    ['history', 'History'],
    ['accommodation', 'Accommodation'],
  ] as const

  return (
    <div className="page">
      <div className="row" style={{ marginBottom: 12 }}>
        <Link to="/discover" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <input
          className="input"
          placeholder="Search places, tours…"
          defaultValue={query}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate({ to: '/discover/search', search: { q: (e.target as HTMLInputElement).value } })
          }}
        />
      </div>

      <div className="row wrap" style={{ marginBottom: 16, gap: 6 }}>
        {filters.map(([key, label]) => (
          <button key={key} className={tab === key ? 'chip chip-active' : 'chip'} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="stack">
        {(tab === 'everything' || tab === 'places') && places.length > 0 ? (
          <Card>
            <div className="eyebrow">Places</div>
            <div className="col" style={{ marginTop: 6 }}>
              {places.map((p) => (
                <Link key={p.id} to="/discover/places/$placeSlug" params={{ placeSlug: p.slug }} className="bold text-small">
                  {p.name}
                </Link>
              ))}
            </div>
          </Card>
        ) : null}

        {(tab === 'everything' || tab === 'experiences') && tours.length > 0 ? (
          <section>
            <div className="eyebrow">Experiences</div>
            <div className="grid-2" style={{ marginTop: 8 }}>
              {tours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </section>
        ) : null}

        {(tab === 'everything' || tab === 'discoveries') && pins.length > 0 ? (
          <section>
            <div className="eyebrow">Discoveries</div>
            <div className="stack" style={{ gap: 10, marginTop: 8 }}>
              {pins.map((pin) => (
                <DiscoveryCard key={pin.id} pin={pin} />
              ))}
            </div>
          </section>
        ) : null}

        {(tab === 'everything' || tab === 'history') && history.length > 0 ? (
          <Card>
            <div className="eyebrow">History</div>
            <div className="col" style={{ marginTop: 6 }}>
              {history.slice(0, 3).map((p) => (
                <Link key={p.id} to="/discover/places/$placeSlug/timeline" params={{ placeSlug: p.slug }} className="text-small">
                  {p.name} timeline
                </Link>
              ))}
            </div>
          </Card>
        ) : null}

        {(tab === 'everything' || tab === 'accommodation') && stays.length > 0 ? (
          <Card>
            <div className="eyebrow">Accommodation</div>
            <div className="col" style={{ marginTop: 6 }}>
              {stays.map((s) => (
                <span key={s.id} className="text-small bold">
                  {s.title}
                </span>
              ))}
            </div>
          </Card>
        ) : null}

        {!query ? (
          <p className="text-faint text-small">Try "whales", "wine", or "castle".</p>
        ) : null}
      </div>
    </div>
  )
}
