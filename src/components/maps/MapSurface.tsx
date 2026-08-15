import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/utils'

/**
 * Map canvas. Renders a static mock surface until a Mapbox token + loader
 * (services/maps/mapbox.ts) are wired. Markers are positioned with x/y
 * percentages (0-100) that map to lat/lng in the real implementation.
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
  return (
    <div className={cx('map-surface', className)} style={{ ...style, minHeight: 220 }} role="region" aria-label="Discovery map of the Cape">
      {children}
      {myLocation ? <div className="map-my-location" style={{ left: `${myLocation.x}%`, top: `${myLocation.y}%` }} /> : null}
    </div>
  )
}
