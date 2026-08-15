import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { DiscoveryCard } from '@/components/ui'
import { getMyPins } from '@/modules/journal/api/journal'

/** T17 — Journal home. Personal travel history. Wireframe spec §19. */
export function JournalHomePage() {
  const [view, setView] = useState<'timeline' | 'map'>('timeline')
  const pins = getMyPins()

  return (
    <div className="page-narrow">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <h1 className="section-title" style={{ fontSize: 20 }}>
          My Travel Journal
        </h1>
        <Link to="/journal/create" className="btn btn-primary btn-sm">
          + Add
        </Link>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        {(
          [
            ['timeline', 'Timeline'],
            ['map', 'Map'],
          ] as const
        ).map(([key, label]) => (
          <button key={key} className={view === key ? 'chip chip-active' : 'chip'} onClick={() => setView(key)}>
            {label}
          </button>
        ))}
      </div>

      {view === 'map' ? (
        <Link to="/journal/map">
          <div className="card card-link text-faint text-small" style={{ padding: 32, textAlign: 'center' }}>
            Open your Cape map →
          </div>
        </Link>
      ) : (
        <div className="stack" style={{ gap: 14 }}>
          <div className="eyebrow">AUG 2026</div>
          {pins.map((pin) => (
            <DiscoveryCard key={pin.id} pin={pin} showBadge={false} />
          ))}
        </div>
      )}
    </div>
  )
}
