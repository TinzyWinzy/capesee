import { Link } from '@tanstack/react-router'
import { PlaceCard } from '@/components/ui'
import { Seo } from '@/components/Seo'
import { getPlaces } from '@/modules/places/api/places'

/** Places directory (list alternative to map). */
export function PlacesListPage() {
  const places = getPlaces()
  return (
    <div className="page">
      <Seo
        title="Places — Western Cape"
        description="Browse verified places across the Western Cape — Castle of Good Hope, Kirstenbosch, Stellenbosch, Hermanus and more. Each place with timeline, discoveries and evidence."
        canonical="/discover/places"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Places in the Western Cape',
          numberOfItems: places.length,
        }}
      />
      <div className="row" style={{ marginBottom: 12 }}>
        <Link to="/discover" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Places</h1>
      </div>
      <div className="grid-2">
        {places.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </div>
  )
}
