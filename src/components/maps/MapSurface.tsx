import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cx } from '@/lib/utils'
import { hasGoogleMapsKey, loadGoogleMaps } from '@/services/maps/googleMaps'
import { fitBounds, projectLatLng, type LatLng } from '@/lib/geo'
import { MapMarker } from '@/components/maps/MapMarker'
import { MapCluster } from '@/components/maps/MapCluster'
import { ICON, TONE, type MapCategory } from '@/components/maps/MapMarker'

export interface MapMarkerSpec {
  id?: string
  lat: number
  lng: number
  category: MapCategory
  label?: string
  active?: boolean
  onClick?: () => void
}

export interface MapClusterSpec {
  lat: number
  lng: number
  count: number
  onClick?: () => void
}

type PinnedSpec =
  | { key: string; kind: 'marker'; lat: number; lng: number; category: MapCategory; label?: string; active?: boolean; onClick?: () => void }
  | { key: string; kind: 'cluster'; lat: number; lng: number; count: number; onClick?: () => void }
  | { key: string; kind: 'you'; lat: number; lng: number }

/**
 * HTML pin anchored to a real coordinate. Rendered inside the map's mouse
 * overlay pane, so it stays glued to the place while panning/zooming and does
 * not require a Map ID (unlike AdvancedMarkerElement). Built lazily because
 * `google` is only defined after the async bootstrap script loads.
 */
interface OverlayCtor {
  new (position: { lat: number; lng: number }, content: HTMLElement): google.maps.OverlayView
}

function createCoordinateOverlay(gmaps: typeof google.maps): OverlayCtor {
  return class CoordinateOverlay extends gmaps.OverlayView {
    private readonly position: google.maps.LatLng
    private readonly node: HTMLElement

    constructor(position: { lat: number; lng: number }, node: HTMLElement) {
      super()
      this.position = new gmaps.LatLng(position.lat, position.lng)
      this.node = node
    }

    onAdd() {
      this.getPanes()?.overlayMouseTarget.appendChild(this.node)
    }

    draw() {
      const pixel = this.getProjection()?.fromLatLngToDivPixel(this.position)
      if (!pixel) return
      this.node.style.left = `${pixel.x}px`
      this.node.style.top = `${pixel.y}px`
      this.node.style.display = 'block'
    }

    onRemove() {
      this.node.parentNode?.removeChild(this.node)
    }
  }
}

/**
 * Map canvas. When VITE_GOOGLE_MAPS_API_KEY is set, renders a live Google Map
 * (Cape Peninsula) with pins anchored to their real lat/lng via DOM overlays.
 * Without a key it keeps the static mock surface and projects the same
 * coordinates onto it, so markers align in both modes.
 */
export function MapSurface({
  markers = [],
  cluster,
  myLocation,
  children,
  className,
  style,
}: {
  markers?: MapMarkerSpec[]
  cluster?: MapClusterSpec
  myLocation?: LatLng
  children?: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const mapHostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const overlayCtorRef = useRef<OverlayCtor | null>(null)
  const registryRef = useRef(new Map<string, { overlay: google.maps.OverlayView; content: HTMLElement }>())
  const [live, setLive] = useState(false)
  const [markerReady, setMarkerReady] = useState(false)

  const pinned = useMemo<PinnedSpec[]>(() => {
    const list: PinnedSpec[] = markers.map((m) => ({
      key: m.id ?? `m:${m.lat}:${m.lng}`,
      kind: 'marker',
      lat: m.lat,
      lng: m.lng,
      category: m.category,
      label: m.label,
      active: m.active,
      onClick: m.onClick,
    }))
    if (cluster && cluster.count >= 2) {
      list.push({ key: '__cluster', kind: 'cluster', lat: cluster.lat, lng: cluster.lng, count: cluster.count, onClick: cluster.onClick })
    }
    if (myLocation) {
      list.push({ key: '__you', kind: 'you', lat: myLocation.lat, lng: myLocation.lng })
    }
    return list
  }, [markers, cluster, myLocation])

  const pinnedRef = useRef(pinned)
  pinnedRef.current = pinned

  const pinnedKey = useMemo(
    () => pinned.map((p) => (p.kind === 'marker' ? `${p.key}:${p.active ? 1 : 0}` : p.key)).join('|'),
    [pinned],
  )

  const fallbackBounds = useMemo(() => fitBounds(pinned.map((p) => ({ lat: p.lat, lng: p.lng }))), [pinned])

  useEffect(() => {
    if (!hasGoogleMapsKey()) return
    let cancelled = false

    loadGoogleMaps()
      .then((gmaps) => {
        if (cancelled || !mapHostRef.current) return
        const map = new gmaps.Map(mapHostRef.current, {
          center: { lat: -33.9249, lng: 18.4241 },
          zoom: 11,
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#e8eef3',
        })
        const bounds = fitBounds(pinnedRef.current.map((p) => ({ lat: p.lat, lng: p.lng })))
        map.fitBounds(new gmaps.LatLngBounds(bounds.sw, bounds.ne))
        mapRef.current = map
        overlayCtorRef.current = createCoordinateOverlay(gmaps)
        setLive(true)
        setMarkerReady(true)
      })
      .catch((error) => {
        console.warn('[capesee] Live map unavailable, showing mock surface:', error)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const Ctor = overlayCtorRef.current
    if (!map || !Ctor || !markerReady) return

    const specs = pinnedRef.current
    const seen = new Set<string>()
    let expanded = false
    for (const spec of specs) {
      seen.add(spec.key)
      let entry = registryRef.current.get(spec.key)
      if (!entry) {
        const content = buildContent(spec)
        const overlay = new Ctor({ lat: spec.lat, lng: spec.lng }, content)
        overlay.setMap(map)
        entry = { overlay, content }
        registryRef.current.set(spec.key, entry)
        expanded = true
      }
      if (spec.kind === 'marker') {
        entry.content.classList.toggle('map-pin-active', Boolean(spec.active))
        entry.content.setAttribute('aria-pressed', spec.active ? 'true' : 'false')
        entry.content.style.zIndex = spec.active ? '3' : '2'
      }
    }
    for (const [key, entry] of registryRef.current) {
      if (!seen.has(key)) {
        entry.overlay.setMap(null)
        registryRef.current.delete(key)
      }
    }
    if (expanded) {
      const b = fitBounds(specs.map((p) => ({ lat: p.lat, lng: p.lng })))
      map.fitBounds(new window.google.maps.LatLngBounds(b.sw, b.ne))
    }
  }, [pinnedKey, markerReady])

  return (
    <div
      className={cx('map-surface', live && 'map-surface-live', className)}
      style={{ ...style, minHeight: 220 }}
      role="region"
      aria-label="Discovery map of the Cape"
    >
      <div ref={mapHostRef} className="map-real" aria-hidden />
      {children}
      {!live ? (
        <>
          {pinned
            .filter((p): p is Extract<PinnedSpec, { kind: 'marker' }> => p.kind === 'marker')
            .map((p) => (
              <MapMarker
                key={p.key}
                category={p.category}
                x={projectLatLng(p.lat, p.lng, fallbackBounds).x}
                y={projectLatLng(p.lat, p.lng, fallbackBounds).y}
                label={p.label}
                active={p.active}
                onClick={p.onClick}
              />
            ))}
          {pinned
            .filter((p): p is Extract<PinnedSpec, { kind: 'cluster' }> => p.kind === 'cluster')
            .map((p) => (
              <MapCluster
                key={p.key}
                count={p.count}
                x={projectLatLng(p.lat, p.lng, fallbackBounds).x}
                y={projectLatLng(p.lat, p.lng, fallbackBounds).y}
                onClick={p.onClick}
              />
            ))}
          {myLocation ? (
            <div
              className="map-my-location"
              style={{
                left: `${projectLatLng(myLocation.lat, myLocation.lng, fallbackBounds).x}%`,
                top: `${projectLatLng(myLocation.lat, myLocation.lng, fallbackBounds).y}%`,
              }}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

/** Builds the DOM node anchored to the marker's real coordinate. */
function buildContent(spec: PinnedSpec): HTMLElement {
  const anchor = document.createElement('div')
  anchor.className = 'map-marker-anchor'

  if (spec.kind === 'you') {
    const dot = document.createElement('div')
    dot.className = 'map-my-location'
    anchor.appendChild(dot)
    return anchor
  }

  if (spec.kind === 'cluster') {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'map-cluster'
    button.textContent = String(spec.count)
    button.setAttribute('aria-label', `Explore ${spec.count} nearby places`)
    button.addEventListener('click', () => spec.onClick?.())
    anchor.appendChild(button)
    return anchor
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.className = `map-pin ${TONE[spec.category]}`
  if (spec.active) button.classList.add('map-pin-active')
  button.setAttribute('aria-label', spec.label ?? spec.category)
  button.setAttribute('aria-pressed', spec.active ? 'true' : 'false')
  button.addEventListener('click', () => spec.onClick?.())
  const body = document.createElement('div')
  body.className = 'pin-body'
  const icon = document.createElement('span')
  icon.textContent = ICON[spec.category]
  body.appendChild(icon)
  button.appendChild(body)
  if (spec.label) {
    const label = document.createElement('span')
    label.className = 'pin-label'
    label.textContent = spec.label
    button.appendChild(label)
  }
  anchor.appendChild(button)
  return anchor
}
