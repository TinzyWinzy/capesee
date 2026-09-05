import type { BookableType } from '@/types'
import { PlaceholderPage, PriceDisplay, RatingDisplay, Card } from '@/components/ui'
import { Seo } from '@/components/Seo'
import { Link } from '@tanstack/react-router'
import { getProducts } from '@/modules/bookings/api/products'

/** Results list for stays / transfers / experiences. */
export function CatalogResultsPage({ type, title }: { type: BookableType; title: string }) {
  const products = getProducts(type)
  const unit = type === 'stay' ? '/night' : type === 'transfer' ? '/trip' : '/person'
  const to = type === 'stay' ? '/book/stays/$hotelSlug' : type === 'transfer' ? '/book/transfers/$transferSlug' : '/book/experiences/$experienceSlug'
  const param = type === 'stay' ? 'hotelSlug' : type === 'transfer' ? 'transferSlug' : 'experienceSlug'
  const canonicalMap: Record<BookableType, string> = { tour: '/book/tours', stay: '/book/stays', transfer: '/book/transfers', experience: '/book/experiences' }

  return (
    <div className="page">
      <Seo
        title={title}
        description={`${title} in the Cape — ${products.length} options from verified local providers. Compare, check dates and book on Capesee.`}
        canonical={canonicalMap[type]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: title,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 5).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://www.capesee.com${canonicalMap[type]}/${p.slug}`,
            name: p.title,
          })),
        }}
      />
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
  const detailCanonical: Record<BookableType, string> = {
    tour: `/book/tours/${slug}`,
    stay: `/book/stays/${slug}`,
    transfer: `/book/transfers/${slug}`,
    experience: `/book/experiences/${slug}`,
  }

  return (
    <div className="page-narrow">
      <Seo
        title={product.title}
        description={`${product.title} — from R${product.price} ${product.priceUnit === 'night' ? 'per night' : product.priceUnit === 'trip' ? 'per trip' : 'per person'} · ${product.rating ? `${product.rating}★ (${product.reviewCount} reviews) · ` : ''}Book on Capesee.`}
        canonical={detailCanonical[type]}
        image={product.coverUrl ?? undefined}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': product.type === 'stay' ? 'LodgingBusiness' : 'Product',
          name: product.title,
          image: product.coverUrl ? `https://www.capesee.com${product.coverUrl}` : undefined,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'ZAR',
            availability: 'https://schema.org/InStock',
            url: `https://www.capesee.com${detailCanonical[type]}`,
          },
          aggregateRating: product.rating ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount } : undefined,
        }}
      />
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
