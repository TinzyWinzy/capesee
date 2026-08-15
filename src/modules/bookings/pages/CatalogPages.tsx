import type { BookableType } from '@/types'
import { PlaceholderPage, PriceDisplay, RatingDisplay, Card } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { getProducts } from '@/modules/bookings/api/products'

/** Results list for stays / transfers / experiences. */
export function CatalogResultsPage({ type, title }: { type: BookableType; title: string }) {
  const products = getProducts(type)
  const unit = type === 'stay' ? '/night' : type === 'transfer' ? '/trip' : '/person'
  const to = type === 'stay' ? '/book/stays/$hotelSlug' : type === 'transfer' ? '/book/transfers/$transferSlug' : '/book/experiences/$experienceSlug'
  const param = type === 'stay' ? 'hotelSlug' : type === 'transfer' ? 'transferSlug' : 'experienceSlug'

  return (
    <div className="page">
      <div className="row" style={{ marginBottom: 12 }}>
        <Link to="/book" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">{title}</h1>
      </div>
      <div className="stack" style={{ gap: 12 }}>
        {products.length === 0 ? (
          <PlaceholderPage title={title} description="No products catalogued yet for this type." />
        ) : (
          products.map((p) => (
            <Link key={p.id} to={to} params={{ [param]: p.slug } as never}>
              <Card flush className="card-link">
                <div className="media ratio-16-9">{p.coverUrl ? <img src={p.coverUrl} alt={p.title} /> : <span>{p.title}</span>}</div>
                <div className="col" style={{ padding: 12, gap: 4 }}>
                  <div className="row-between">
                    <span className="bold">{p.title}</span>
                    <RatingDisplay rating={p.rating} reviewCount={p.reviewCount} />
                  </div>
                  <PriceDisplay amount={p.price} unit={unit} />
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

/** Detail page for stays / transfers / experiences. */
export function CatalogDetailPage({ type, slug }: { type: BookableType; slug: string }) {
  const product = getProducts(type).find((p) => p.slug === slug)
  if (!product) return <PlaceholderPage title="Not found" description={`No ${type} matches "${slug}".`} />

  return (
    <div className="page-narrow">
      <div className="row" style={{ marginBottom: 12 }}>
        <Link to={`/book/${type === 'stay' ? 'stays' : type === 'transfer' ? 'transfers' : 'experiences'}`} className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">{product.title}</h1>
      </div>
      <div className="media ratio-16-9">{product.coverUrl ? <img src={product.coverUrl} alt={product.title} /> : <span>{product.title}</span>}</div>
      <Card className="col" style={{ marginTop: 12 }}>
        <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} />
        <PriceDisplay amount={product.price} unit={product.priceUnit === 'night' ? '/night' : product.priceUnit === 'trip' ? '/trip' : '/person'} />
        <p className="text-faint text-small">
          Full {type} details, availability and checkout wiring land in Sprint 2.
        </p>
        <Link to="/book/cart" className="btn btn-primary btn-block">
          Add to trip
        </Link>
      </Card>
    </div>
  )
}
