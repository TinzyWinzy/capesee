import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, DatePicker, GuestSelector, TourCard } from '@/components/ui'
import { REGIONS } from '@/lib/constants'
import { mockTours } from '@/lib/mock'

/** T09 — Book home. Wireframe spec §11. */
export function BookHomePage() {
  const [guests, setGuests] = useState(2)

  return (
    <div className="page">
      <h1 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>
        Book your Cape experience
      </h1>

      <div className="row wrap" style={{ marginBottom: 14 }}>
        {['Tours', 'Stays', 'Transfers'].map((t) => (
          <Link
            key={t}
            to={t === 'Tours' ? '/book/tours' : t === 'Stays' ? '/book/stays' : '/book/transfers'}
            className="chip"
          >
            {t}
          </Link>
        ))}
      </div>

      <Card className="stack">
        <label>
          <span className="label">Where?</span>
          <select className="select" defaultValue="western-cape">
            {REGIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid-2">
          <DatePicker label="From" value="2026-08-14" />
          <DatePicker label="To" value="2026-08-16" />
        </div>
        <GuestSelector value={guests} onChange={setGuests} />
        <Link to="/book/tours" className="btn btn-primary btn-block">
          Search
        </Link>
      </Card>

      <div className="row-between" style={{ margin: '20px 0 10px' }}>
        <h2 className="section-title">Recommended</h2>
      </div>
      <div className="grid-2">
        {mockTours.slice(0, 3).map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}
