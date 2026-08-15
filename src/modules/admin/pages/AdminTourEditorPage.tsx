import { Link } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'
import { AdminInventoryPanel } from '@/modules/admin/components/AdminInventoryPanel'

/**
 * A03 — Tour editor. Key rule: tour stops select a PLACE, not isolated
 * geographic coordinates (spec §29). Wireframe spec §29.
 */
export function AdminTourEditorPage({ tourId }: { tourId?: string }) {
  return (
    <div className="stack">
      <div className="row">
        <Link to="/admin/tours" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">{tourId ? 'Edit Tour' : 'Create Tour'}</h1>
      </div>

      <Card className="stack">
        <span className="eyebrow">Basic Information</span>
        <div className="grid-2">
          <label>
            <span className="label">Title</span>
            <input className="input" placeholder="Stellenbosch Wine Experience" />
          </label>
          <label>
            <span className="label">Region</span>
            <select className="select">
              <option>Western Cape</option>
              <option>Eastern Cape</option>
            </select>
          </label>
        </div>
        <label>
          <span className="label">Type</span>
          <input className="input" placeholder="Wine tour" />
        </label>
        <label>
          <span className="label">Description</span>
          <textarea className="textarea" />
        </label>
      </Card>

      <Card className="stack">
        <span className="eyebrow">Pricing</span>
        <div className="grid-2">
          <label>
            <span className="label">Adult</span>
            <input className="input" type="number" placeholder="1250" />
          </label>
          <label>
            <span className="label">Child</span>
            <input className="input" type="number" placeholder="850" />
          </label>
        </div>
      </Card>

      {!tourId ? <Card className="stack">
        <span className="eyebrow">Availability</span>
        <div className="grid-2">
          <label>
            <span className="label">Dates</span>
            <input className="input" placeholder="14–17 Aug" />
          </label>
          <label>
            <span className="label">Capacity</span>
            <input className="input" type="number" placeholder="12" />
          </label>
        </div>
      </Card> : <AdminInventoryPanel productId={tourId} />}

      <Card className="stack">
        <div className="row-between">
          <span className="eyebrow">Itinerary</span>
          <Button variant="outline" size="sm">
            + Add stop
          </Button>
        </div>
        <div className="card">
          <span className="label">STOP 1</span>
          <input className="input" placeholder="Search / Create Place — e.g. Stellenbosch wine estate" style={{ marginBottom: 8 }} />
          <div className="grid-2">
            <input className="input" placeholder="Arrival time" />
            <input className="input" placeholder="Duration" />
          </div>
          <p className="text-faint text-xs" style={{ marginTop: 8 }}>
            Stops must link to a PLACE so timeline and discoveries enrich each tour.
          </p>
        </div>
      </Card>

      <div className="row">
        <Button variant="outline">Save Draft</Button>
        <Button variant="primary">Publish</Button>
      </div>
    </div>
  )
}
