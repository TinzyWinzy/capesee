import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { BookableProduct } from '@/types'
import { Badge, DatePicker, GuestSelector, RatingDisplay } from '@/components/ui'
import { Seo } from '@/components/Seo'
import { MapSurface } from '@/components/maps/MapSurface'
import { formatRand } from '@/lib/format'
import { useCartStore } from '@/stores/cart'

/** T11 — Experience detail and booking configuration. */
export function TourDetailPage({ tour }: { tour: BookableProduct }) {
  const add = useCartStore((state) => state.add)
  const navigate = useNavigate()
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [guests, setGuests] = useState(2)
  const [saved, setSaved] = useState(false)
  const total = tour.price * guests

  const addToTrip = () => {
    add({ productId: tour.id, type: tour.type, qty: guests, date })
    navigate({ to: '/book/cart' })
  }

  return (
    <main className="tour-detail-shell">
      <Seo
        title={tour.title}
        description={`${tour.title} — ${tour.durationHours ? `${tour.durationHours} hours · ` : ''}${tour.guideIncluded ? 'Local guide included · ' : ''}From ${formatRand(tour.price)} per person. Book on Capesee.`}
        canonical={`/book/tours/${tour.slug}`}
        image={tour.coverUrl ?? undefined}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          name: tour.title,
          description: `${tour.title} in the Western Cape`,
          image: tour.coverUrl ? `https://www.capesee.com${tour.coverUrl}` : undefined,
          offers: {
            '@type': 'Offer',
            price: tour.price,
            priceCurrency: 'ZAR',
            availability: 'https://schema.org/InStock',
            url: `https://www.capesee.com/book/tours/${tour.slug}`,
          },
          aggregateRating: tour.rating ? { '@type': 'AggregateRating', ratingValue: tour.rating, reviewCount: tour.reviewCount } : undefined,
        }}
      />
      <section className="tour-hero">
        {tour.coverUrl ? (
          <img src={tour.coverUrl} alt={`${tour.title} experience`} />
        ) : (
          <div className="tour-hero-landscape" role="img" aria-label={`Illustrated landscape for ${tour.title}`}>
            <span className="tour-landscape-sun" aria-hidden />
            <span className="tour-landscape-ridge ridge-one" aria-hidden />
            <span className="tour-landscape-ridge ridge-two" aria-hidden />
            <span className="tour-landscape-route" aria-hidden />
          </div>
        )}
        <div className="tour-hero-toolbar">
          <Link to="/book/tours" className="place-round-action" aria-label="Back to tours">←</Link>
          <button type="button" className={saved ? 'place-round-action is-active' : 'place-round-action'} onClick={() => setSaved((value) => !value)} aria-pressed={saved} aria-label={saved ? 'Remove saved tour' : 'Save tour'}>{saved ? '♥' : '♡'}</button>
        </div>
        <div className="tour-hero-caption">
          <p className="eyebrow">Guided Cape experience</p>
          <h1>{tour.title}</h1>
          <div className="tour-hero-meta">
            <RatingDisplay rating={tour.rating} reviewCount={tour.reviewCount} />
            {tour.durationHours ? <span>{tour.durationHours} hours</span> : null}
            <span>Western Cape</span>
          </div>
        </div>
      </section>

      <div className="tour-detail-layout">
        <div className="tour-story">
          <section className="tour-introduction">
            <p className="eyebrow">The experience</p>
            <h2>A guided day shaped by the places along the way.</h2>
            <p>Travel with local context close at hand. Your confirmed booking brings the meeting details, itinerary and offline-ready trip information together in one place.</p>
            <div className="tour-inclusion-line">
              {tour.guideIncluded ? <Badge tone="success">Local guide included</Badge> : null}
              {tour.pickupIncluded ? <Badge tone="success">Pickup included</Badge> : null}
              <Badge tone="info">Mobile ticket</Badge>
            </div>
          </section>

          <section className="tour-itinerary-section">
            <div className="tour-section-heading">
              <div><p className="eyebrow">Your day</p><h2>Itinerary at a glance</h2></div>
              <span>{tour.durationHours ?? 'Full'} hours</span>
            </div>
            <div className="tour-itinerary-list">
              <article><span>01</span><div><strong>{tour.pickupIncluded ? 'Welcome and pickup' : 'Meet your guide'}</strong><p>Final meeting details are added to your trip after confirmation.</p></div></article>
              <article><span>02</span><div><strong>The guided experience</strong><p>Explore with destination context, local guidance and time to take in each stop.</p></div></article>
              <article><span>03</span><div><strong>Close the journey</strong><p>Your guide confirms the return or final meeting point in the booked itinerary.</p></div></article>
            </div>
          </section>

          <section className="tour-route-section">
            <div className="tour-section-heading">
              <div><p className="eyebrow">Route context</p><h2>Across the Western Cape</h2></div>
              <Link to="/discover/map" className="editorial-link">Explore map →</Link>
            </div>
            <MapSurface
              className="tour-route-map"
              markers={[
                { id: 'route-start', category: 'Tour', lat: -33.9057, lng: 18.4203, label: 'Start' },
                { id: 'route-mid', category: 'Place', lat: -33.9518, lng: 18.3813, label: 'Experience' },
                { id: 'route-end', category: 'Tour', lat: -34.1897, lng: 18.4319, label: 'Return' },
              ]}
            />
          </section>

          <section className="tour-assurance">
            <div><span aria-hidden>◇</span><strong>Clear confirmation</strong><p>Meeting and pickup instructions are stored with your trip.</p></div>
            <div><span aria-hidden>◌</span><strong>Offline ready</strong><p>Your ticket and confirmed itinerary are designed for offline access.</p></div>
            <div><span aria-hidden>↺</span><strong>Terms before payment</strong><p>Cancellation conditions are shown before you complete checkout.</p></div>
          </section>
        </div>

        <aside className="tour-booking-panel">
          <p className="eyebrow">Reserve your place</p>
          <div className="tour-booking-price"><small>From</small><strong>{formatRand(tour.price)}</strong><span>per person</span></div>
          <div className="tour-booking-controls">
            <DatePicker label="Date" value={date} onChange={setDate} />
            <div className="tour-guest-control"><GuestSelector value={guests} onChange={setGuests} /></div>
          </div>
          <dl className="tour-price-breakdown">
            <div><dt>{formatRand(tour.price)} × {guests} guests</dt><dd>{formatRand(total)}</dd></div>
            <div className="tour-price-total"><dt>Total</dt><dd>{formatRand(total)}</dd></div>
          </dl>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={addToTrip}>Add to trip</button>
          <p className="tour-booking-note">You won’t be charged yet.</p>
        </aside>
      </div>
    </main>
  )
}
