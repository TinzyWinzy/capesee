import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Badge, Card } from '@/components/ui'
import { getClaims } from '@/modules/harvest/api/harvest'

type HarvestTab = 'awaiting' | 'sources' | 'conflict'

const TABS: { id: HarvestTab; label: string; status: string }[] = [
  { id: 'awaiting', label: 'Awaiting Review', status: 'awaiting_review' },
  { id: 'sources', label: 'Needs Sources', status: 'needs_sources' },
  { id: 'conflict', label: 'Conflict', status: 'conflict' },
]

/** A07 — Harvest intelligence queue. Wireframe spec §33. Approve/reject mutations land in Sprint 4. */
export function AdminHarvestQueuePage() {
  const [tab, setTab] = useState<HarvestTab>('awaiting')
  const claims = getClaims()

  const rows = claims.filter((c) => c.status === TABS.find((t) => t.id === tab)?.status)

  return (
    <div className="stack">
      <h1 className="section-title">HARVEST QUEUE</h1>

      <div className="row wrap">
        {TABS.map((t) => {
          const count = claims.filter((c) => c.status === t.status).length
          return (
            <button
              key={t.id}
              className={tab === t.id ? 'chip chip-active' : 'chip'}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
            >
              {t.label} {count}
            </button>
          )
        })}
      </div>

      {rows.length === 0 ? (
        <Card>
          <p className="text-faint text-small">Nothing in this queue.</p>
        </Card>
      ) : (
        <div className="stack">
          {rows.map((claim) => (
            <Card key={claim.id} className="stack">
              <span className="eyebrow">{claim.placeName}</span>
              <p className="text-small" style={{ margin: 0 }}>
                <span className="bold">{claim.year}.</span> {claim.summary}
              </p>
              <div className="row wrap">
                <Badge tone="gold">Confidence {claim.confidence}%</Badge>
                <Badge tone="info">Evidence agreement {claim.sourceAgreement}</Badge>
                <Badge tone="default">{claim.sourceCount} sources</Badge>
              </div>
              <Link to="/admin/harvest/$claimId" params={{ claimId: claim.id }} className="btn btn-outline btn-sm">
                View Evidence
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
