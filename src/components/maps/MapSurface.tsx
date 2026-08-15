import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cx } from '@/lib/utils'
import { hasGoogleMapsKey, loadGoogleMaps } from '@/services/maps/googleMaps'

/**
 * Map canvas. Renders a live Google Map (Cape Peninsula) underneath the
 * existing percentage-positioned markers whenever VITE_GOOGLE_MAPS_API_KEY is
 * set. Without a key it keeps rendering the static mock surface, so the app
 * degrades gracefully and markers/clusters keep working in both modes.
 */
export function MapSurface({
  children,
  myLocation,
  className,
  style,
}: {
  children?: ReactNode
  myLocation?: { x: number; y: number }
  className?: string
  style?: CSSProperties
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!hasGoogleMapsKey()) return
    let cancelled = false

    loadGoogleMaps()
      .then((gmaps) => {
        if (cancelled || !mapRef.current) return
        const map = new gmaps.Map(mapRef.current, {
          center: { lat: -33.9249, lng: 18.4241 },
          zoom: 11,
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#e8eef3',
        })
        map.fitBounds(
          new gmaps.LatLngBounds(
            { lat: -34.05, lng: 18.32 },
            { lat: -33.76, lng: 18.58 },
          ),
        )
        setLive(true)
      })
      .catch((error) => {
        console.warn('[capesee] Live map unavailable, showing mock surface:', error)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className={cx('map-surface', live && 'map-surface-live', className)}
      style={{ ...style, minHeight: 220 }}
      role="region"
      aria-label="Discovery map of the Cape"
    >
      <div ref={mapRef} className="map-real" aria-hidden />
      {children}
      {myLocation ? <div className="map-my-location" style={{ left: `${myLocation.x}%`, top: `${myLocation.y}%` }} /> : null}
    </div>
  )
}
