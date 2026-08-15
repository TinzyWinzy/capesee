import { useState } from 'react'
import { Badge, Button, Card } from '@/components/ui'
import { getModerationQueue, moderateDiscovery } from '@/modules/admin/api/moderation'
import { getPlaceById } from '@/lib/mock'
import { timeAgo } from '@/lib/format'

/** A06 — Discovery moderation queue. Wireframe spec §32. */
export function AdminDiscoveryModerationPage() {
  const queue = getModerationQueue()
  const [decision, setDecision] = useState<Record<string, 'approved' | 'rejected'>>({})
  const [busyId, setBusyId] = useState<string>()
  const [error, setError] = useState<string>()

  const decide = async (id: string, nextDecision: 'approved' | 'rejected') => {
    setBusyId(id)
    setError(undefined)
    try {
      await moderateDiscovery(id, nextDecision)
      setDecision((current) => ({ ...current, [id]: nextDecision }))
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : 'Moderation failed.')
    } finally {
      setBusyId(undefined)
    }
  }

  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Discovery Moderation</h1>
        <Badge tone="gold">Pending {queue.length}</Badge>
      </div>
      {error ? <div className="error-box" role="alert">{error}</div> : null}

      {queue.length === 0 ? (
        <Card>
          <p className="text-faint text-small">Queue clear.</p>
        </Card>
      ) : (
        queue.map((pin) => {
          const place = pin.placeId ? getPlaceById(pin.placeId) : undefined
          const state = decision[pin.id]
          return (
            <Card key={pin.id} className="stack">
              <div className="media ratio-16-9">{pin.photoUrl ? <img src={pin.photoUrl} alt={pin.title} /> : <span>{pin.title}</span>}</div>
              <span className="bold text-small">{pin.title}</span>
              <div className="row wrap">
                <span className="text-faint text-xs">Reported by {pin.authorName}</span>
                <span className="text-faint text-xs">• {timeAgo(pin.createdAt)}</span>
              </div>
              <div className="row-between">
                <span className="text-faint text-xs">Location</span>
                <span className="text-small">{place?.name ?? 'Unmapped'}</span>
              </div>
              <div className="row-between">
                <span className="text-faint text-xs">AI classification</span>
                <span className="text-small">{pin.category}</span>
              </div>

              {state ? (
                <Badge tone={state === 'approved' ? 'success' : 'danger'}>
                  {state === 'approved' ? 'Approved' : 'Rejected'}
                </Badge>
              ) : (
                <div className="row wrap">
                  <Button variant="primary" size="sm" disabled={busyId === pin.id} onClick={() => void decide(pin.id, 'approved')}>
                    {busyId === pin.id ? 'Saving…' : 'Approve'}
                  </Button>
                  <Button variant="outline" size="sm" disabled={busyId === pin.id} onClick={() => void decide(pin.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
