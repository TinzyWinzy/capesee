import { useState } from 'react'
import { Card } from '@/components/ui'

export function PrivacyPage() {
  const [journalPublic, setJournalPublic] = useState(true)
  const [showOnMap, setShowOnMap] = useState(true)
  const [locationSharing, setLocationSharing] = useState(false)

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>Privacy</h1>
      <Card className="stack">
        <label className="row-between">
          <span className="text-small">Public journal</span>
          <input type="checkbox" checked={journalPublic} onChange={(event) => setJournalPublic(event.currentTarget.checked)} />
        </label>
        <label className="row-between">
          <span className="text-small">Show my discoveries on the map</span>
          <input type="checkbox" checked={showOnMap} onChange={(event) => setShowOnMap(event.currentTarget.checked)} />
        </label>
        <label className="row-between">
          <span className="text-small">Location sharing for nearby features</span>
          <input type="checkbox" checked={locationSharing} onChange={(event) => setLocationSharing(event.currentTarget.checked)} />
        </label>
      </Card>
      <p className="text-faint text-xs" style={{ marginTop: 12 }}>
        Choices apply to this device. Account-wide privacy sync arrives with the profile settings rollout.
      </p>
    </div>
  )
}
