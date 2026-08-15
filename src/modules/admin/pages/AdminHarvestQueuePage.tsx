import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Badge, Button, Card } from '@/components/ui'
import { getClaims } from '@/modules/harvest/api/harvest'

/** A07 — Harvest intelligence queue. Wireframe spec §33. */
export function AdminHarvestQueuePage() {
  const [tab, setTab] = useState<'awaiting' | 'sources' | 'conflict'>('awaiting')
  const claims = getClaims()

  return (
    <div className="stack">
      <h1 className="section-title">HARVEST QUEUE</h1>

      <div className="row wrap">
        <button className={tab === 'awaiting' ? 'chip chip-active' : 'chip'} onClick={() => setTab('awaiting')}>
          Awaiting Review 14
        </button>
        <button className={tab === 'sources' ? 'chip chip-active' : 'chip'} onClick={() => setTab('sources')}>
          Needs Sources 3
        </button>
        <button className={tab === 'conflict' ? 'chip chip-active' : 'chip'} onClick={() => setTab('conflict')}>
          Conflict 2
        </button>
      </div>

      <div className="stack">
        {claims
          .filter((c) => (tab === 'awaiting' ? c.status === 'awaiting_review' : tab === 'sources' ? c.status === 'needs_sources' : c.status === 'conflict'))
          .map((claim) => (
            <Card key={claim.id} className="stack">
              <span className="eyebrow">{claim.placeName}</span>
              <p className="text-small" style={{ margin: 0 }}>
                <span className="bold">{claim.year}.</span> {claim.summary}
              </p>
              <div className="row wrap">
                <Badge tone="gold">Confidence {claim.confidence}%</Badge>
                <Badge tone="info">Evidence agreement {claim.sourceAgreement}</Badge>
              </div>
              <div className="row wrap">
                <Link to="/admin/harvest/$claimId" params={{ claimId: claim.id }}>
                  <Button variant="outline" size="sm">
                    View Evidence
                  </Button>
                </Link>
                <Button variant="primary" size="sm">
                  Approve
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Reject
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
