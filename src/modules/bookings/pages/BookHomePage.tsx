import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, DatePicker, GuestSelector, TourCard } from '@/components/ui'
import { Seo } from '@/components/Seo'
import { REGIONS } from '@/lib/constants'
import { mockTours } from '@/lib/mock'

/** T09 — Book home. Wireframe spec §11. */
export function BookHomePage() {
  const [guests, setGuests] = useState(2)
  const [region, setRegion] = useState('western-cape')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  return (
    <div className="page">
      <Seo
        title="Book — Tours, Stays & Transfers"
        description="Book Cape tours, stays and transfers — all rooted in place. Stellenbosch wine tours, Peninsula routes and coastal stays with local guides. Check dates and guests."
        canonical="/book"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Book your Cape experience',
          description: 'Tours, stays and transfers across the Western Cape.',
        }}
      />
      <header className="book-home-head">
        <p className="eyebrow">Plan your trip</p>
        <h1 className="section-title">Book your Cape experience</h1>
      </header>

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
          <span className="label">Region</span>
          <select className="select" value={region} onChange={(event) => setRegion(event.currentTarget.value)}>
            {REGIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid-2">
          <DatePicker label="From" value={from} onChange={setFrom} />
          <DatePicker label="To" value={to} onChange={setTo} />
        </div>
        <GuestSelector value={guests} onChange={setGuests} />
        <Link to="/book/tours" className="btn btn-primary btn-block">
          Search experiences
        </Link>
        <p className="text-faint text-xs">
          {region === 'western-cape' ? 'Tours, stays and transfers across the Cape.' : 'Expanding catalog — more regions arriving soon.'}
        </p>
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
