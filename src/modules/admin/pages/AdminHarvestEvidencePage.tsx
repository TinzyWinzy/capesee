import { Link, useNavigate } from '@tanstack/react-router'
import { Badge, Button, Card } from '@/components/ui'
import { getClaim, getSourcesForClaim } from '@/modules/harvest/api/harvest'

/** A08 — Harvest evidence review. Admins inspect the evidence behind a claim. Wireframe spec §34. */
export function AdminHarvestEvidencePage({ claimId }: { claimId: string }) {
  const navigate = useNavigate()
  const claim = getClaim(claimId)
  const sources = getSourcesForClaim(claimId)

  if (!claim) {
    return (
      <div className="state">
        <div className="state-title">Claim not found</div>
        <Button variant="outline" onClick={() => navigate({ to: '/admin/harvest' })}>
          Back to queue
        </Button>
      </div>
    )
  }

  return (
    <div className="stack">
      <div className="row">
        <Link to="/admin/harvest" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <div>
          <h1 className="section-title">{claim.placeName}</h1>
          <span className="badge badge-info">Timeline Candidate</span>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <Card className="stack">
          <span className="eyebrow">AI Summary</span>
          <p className="text-small" style={{ margin: 0 }}>
            {claim.summary}
          </p>
          <div className="row-between">
            <span className="text-faint text-xs">Year</span>
            <span className="bold text-small">{claim.year}</span>
          </div>
          <div className="row-between">
            <span className="text-faint text-xs">Confidence</span>
            <Badge tone="gold">{claim.confidence}%</Badge>
          </div>
        </Card>

        <Card className="stack">
          <span className="eyebrow">Evidence</span>
          {sources.map((s) => (
            <div key={s.name} className="card">
              <div className="row-between">
                <span className="bold text-small">{s.name}</span>
                <Badge tone="info">{s.kind.replace(/_/g, ' ')}</Badge>
              </div>
              <p className="text-faint text-xs" style={{ marginTop: 4, marginBottom: 0 }}>
                “{s.excerpt}”
              </p>
            </div>
          ))}
        </Card>
      </div>

      <div className="row">
        <Button variant="ghost" onClick={() => navigate({ to: '/admin/harvest' })}>
          Reject
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/admin/harvest' })}>
          Edit
        </Button>
        <Button variant="primary" onClick={() => navigate({ to: '/admin/harvest' })}>
          Approve & Publish
        </Button>
      </div>
    </div>
  )
}
