import { CATEGORIES } from '@/lib/constants'

export type MapCategory = (typeof CATEGORIES)[number]

export const TONE: Record<MapCategory, string> = {
  Place: 'map-pin-place',
  'Historical site': 'map-pin-history',
  'Traveler discovery': 'map-pin-discovery',
  Tour: 'map-pin-tour',
  Accommodation: 'map-pin-stay',
  Food: 'map-pin-food',
  Wildlife: 'map-pin-wildlife',
  Experience: 'map-pin-tour',
  Event: 'map-pin-gold',
}

export const ICON: Record<MapCategory, string> = {
  Place: '⌖',
  'Historical site': '◈',
  'Traveler discovery': '✶',
  Tour: '✦',
  Accommodation: '☰',
  Food: '✕',
  Wildlife: '❋',
  Experience: '✦',
  Event: '◉',
}

/** A single map marker positioned by percentage within the MapSurface. */
export function MapMarker({
  category,
  x,
  y,
  label,
  active,
  onClick,
}: {
  category: MapCategory
  x: number
  y: number
  label?: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={`map-pin ${TONE[category]} ${active ? 'map-pin-active' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      aria-label={label ?? category}
      aria-pressed={active}
    >
      <div className="pin-body">
        <span>{ICON[category]}</span>
      </div>
      {label ? <span className="pin-label">{label}</span> : null}
    </button>
  )
}
