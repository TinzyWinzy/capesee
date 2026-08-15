import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, FilterDrawer, useFilterDrawer } from '@/components/ui'
import { MapSurface } from '@/components/maps/MapSurface'
import { useMapMarkers, type MapMarkerData } from '@/modules/maps/hooks/useMapMarkers'
import { distanceLabel } from '@/lib/format'
import { haversineKm, type LatLng } from '@/lib/geo'

const FILTERS = ['All', 'Places', 'History', 'Wildlife', 'Food'] as const
type MapFilter = (typeof FILTERS)[number]

const FILTER_CATEGORIES: Record<Exclude<MapFilter, 'All'>, Set<MapMarkerData['category']>> = {
  Places: new Set(['Place']),
  History: new Set(['Historical site']),
  Wildlife: new Set(['Wildlife']),
  Food: new Set(['Food']),
}

/** Cluster anchor and the radius it groups — around Table Mountain, where the bowl and gardens sit. */
const CLUSTER_ANCHOR: LatLng = { lat: -33.9622, lng: 18.4098 }
const CLUSTER_RADIUS_KM = 8

/** T02 — Capesee's primary discovery surface. Markers are pinned to real lat/lng. */
export function DiscoverMapPage() {
  const markers = useMapMarkers()
  const filters = useFilterDrawer()
  const [activeFilter, setActiveFilter] = useState<MapFilter>('All')
  const [radiusKm, setRadiusKm] = useState(10)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(markers[0]?.id ?? '')
  const [locationState, setLocationState] = useState<'idle' | 'locating' | 'located' | 'unavailable'>('idle')
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)
  const [areaLabel, setAreaLabel] = useState('Cape Town bowl')

  const visibleMarkers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return markers.filter((marker) => {
      const categoryMatch = activeFilter === 'All' || FILTER_CATEGORIES[activeFilter].has(marker.category)
      const radiusMatch = marker.distanceMeters <= radiusKm * 1000
      const searchMatch = !normalizedQuery || `${marker.label} ${marker.context}`.toLowerCase().includes(normalizedQuery)
      return categoryMatch && radiusMatch && searchMatch
    })
  }, [activeFilter, markers, query, radiusKm])

  const selected = visibleMarkers.find((marker) => marker.id === selectedId) ?? visibleMarkers[0]

  const cluster = useMemo(() => {
    const nearby = visibleMarkers.filter((marker) => haversineKm(CLUSTER_ANCHOR, marker) <= CLUSTER_RADIUS_KM)
    return nearby.length >= 2
      ? { lat: CLUSTER_ANCHOR.lat, lng: CLUSTER_ANCHOR.lng, count: nearby.length, onClick: () => setRadiusKm(CLUSTER_RADIUS_KM) }
      : undefined
  }, [visibleMarkers])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('unavailable')
      return
    }
    setLocationState('locating')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        setLocationState('located')
        setAreaLabel('Around your location')
      },
      () => setLocationState('unavailable'),
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }

  const searchThisArea = () => {
    setAreaLabel('Visible map area')
    setQuery('')
  }

  return (
    <main className="map-page-shell">
      <header className="map-toolbar">
        <Link to="/discover" aria-label="Back to Discover" className="map-back-button">←</Link>
        <label className="map-search-field">
          <span aria-hidden>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places and discoveries" />
        </label>
        <Button variant="outline" size="sm" onClick={filters.toggle}>
          Filters <span className="map-filter-count">{activeFilter === 'All' ? 0 : 1}</span>
        </Button>
      </header>

      <div className="map-workspace">
        <section className="map-stage" aria-label="Interactive discovery map">
          <MapSurface
            className="map-full-canvas"
            markers={visibleMarkers.map((marker) => ({
              id: marker.id,
              lat: marker.lat,
              lng: marker.lng,
              category: marker.category,
              label: marker.label,
              active: selected?.id === marker.id,
              onClick: () => setSelectedId(marker.id),
            }))}
            cluster={cluster}
            myLocation={userLocation ?? undefined}
          >
            <div className="map-water-label" aria-hidden>TABLE BAY</div>
            <div className="map-place-label map-place-label-one" aria-hidden>CITY BOWL</div>
            <div className="map-place-label map-place-label-two" aria-hidden>TABLE MOUNTAIN</div>
          </MapSurface>

          <div className="map-stage-top">
            <button type="button" className="map-area-action" onClick={searchThisArea}>
              <span aria-hidden>↻</span> Search this area
            </button>
          </div>

          <div className="map-controls" aria-label="Map controls">
            <button type="button" aria-label="Zoom in">＋</button>
            <button type="button" aria-label="Zoom out">−</button>
            <button type="button" aria-label="Use my location" onClick={requestLocation} className={locationState === 'located' ? 'is-active' : ''}>
              {locationState === 'locating' ? '…' : '◎'}
            </button>
          </div>

          {visibleMarkers.length === 0 ? (
            <div className="map-empty-state">
              <strong>No matches in this area</strong>
              <span>Try another category or increase your distance.</span>
              <button type="button" onClick={() => { setActiveFilter('All'); setRadiusKm(10); setQuery('') }}>Reset map</button>
            </div>
          ) : null}

          {locationState === 'unavailable' ? <div className="map-status-toast">Location is unavailable. You can still explore the map.</div> : null}
        </section>

        <aside className="map-results-panel">
          <div className="map-results-header">
            <div>
              <p className="eyebrow">{areaLabel}</p>
              <h1>{visibleMarkers.length} places to explore</h1>
            </div>
            <Link to="/discover/nearby" className="editorial-link">List view →</Link>
          </div>

          <div className="map-filter-strip" aria-label="Quick filters">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={filter === activeFilter ? 'is-active' : ''}
                aria-pressed={filter === activeFilter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="map-result-list" aria-live="polite">
            {visibleMarkers.map((marker) => (
              <ResultCard key={marker.id} marker={marker} active={selected?.id === marker.id} onSelect={() => setSelectedId(marker.id)} />
            ))}
          </div>
        </aside>
      </div>

      <FilterDrawer open={filters.open} onClose={filters.close}>
        <div className="map-filter-form">
          <fieldset>
            <legend className="label">Show on map</legend>
            <div className="map-filter-options">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={filter === activeFilter ? 'chip chip-active' : 'chip'}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">Distance</legend>
            <div className="map-filter-options">
              {[2, 5, 10].map((distance) => (
                <button
                  key={distance}
                  type="button"
                  className={distance === radiusKm ? 'chip chip-active' : 'chip'}
                  onClick={() => setRadiusKm(distance)}
                >
                  Within {distance} km
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </FilterDrawer>
    </main>
  )
}

function ResultCard({ marker, active, onSelect }: { marker: MapMarkerData; active: boolean; onSelect: () => void }) {
  const detailLink = marker.entityType === 'place' && marker.slug ? (
    <Link to="/discover/places/$placeSlug" params={{ placeSlug: marker.slug }}>Open place <span aria-hidden>↗</span></Link>
  ) : (
    <Link to="/journal/pin/$pinId" params={{ pinId: marker.id }}>Open report <span aria-hidden>↗</span></Link>
  )

  return (
    <article className={active ? 'map-result-card is-active' : 'map-result-card'}>
      <button type="button" className="map-result-select" onClick={onSelect} aria-label={`Show ${marker.label} on map`}>
        <span className={`map-result-symbol map-result-symbol-${marker.entityType}`} aria-hidden>{marker.entityType === 'place' ? '⌖' : '✶'}</span>
        <span className="map-result-copy">
          <span className="map-result-meta">{marker.verified ? 'Verified place' : 'Traveler report'} · {distanceLabel(marker.distanceMeters)}</span>
          <strong>{marker.label}</strong>
          <small>{marker.context}</small>
        </span>
      </button>
      {active ? <div className="map-result-link">{detailLink}</div> : null}
    </article>
  )
}
