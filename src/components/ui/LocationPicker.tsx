import { useState } from 'react'
import { Button } from './Button'

/** Picks a location: "current location" (default) or map point (stub). */
export function LocationPicker({ onPick }: { onPick?: (coords: { lat: number; lng: number } | null) => void }) {
  const [mode, setMode] = useState<'current' | 'pin'>('current')
  return (
    <div className="col">
      <div className="row wrap">
        <button
          type="button"
          className={mode === 'current' ? 'chip chip-active' : 'chip'}
          onClick={() => {
            setMode('current')
            onPick?.(null)
          }}
        >
          📍 Current location
        </button>
        <button
          type="button"
          className={mode === 'pin' ? 'chip chip-active' : 'chip'}
          onClick={() => setMode('pin')}
        >
          Drop a pin
        </button>
      </div>
      {mode === 'pin' ? (
        <div className="map-surface ratio-16-9">
          <span className="text-faint text-small" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            Tap to place pin (map picker in Sprint 3)
          </span>
        </div>
      ) : (
        <div className="row">
          <span className="text-small text-muted">Using device location</span>
          <Button variant="ghost" size="sm">Refresh</Button>
        </div>
      )}
    </div>
  )
}
