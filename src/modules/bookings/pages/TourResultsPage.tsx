import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, FilterDrawer, SkeletonCard, TourCard, useFilterDrawer } from '@/components/ui'
import { Seo } from '@/components/Seo'
import { fetchProducts, getProducts } from '@/modules/bookings/api/products'
import { getSupabase } from '@/services/supabase/client'
import { useAsyncData } from '@/lib/useAsyncData'

/** T10 — Tour search results. Live from Supabase (published only) with mock fallback. */
export function TourResultsPage() {
  const [sort, setSort] = useState<'recommended' | 'price'>('recommended')
  const filters = useFilterDrawer()
  const hasSupabase = Boolean(getSupabase())
  const { data: live, loading } = useAsyncData(() => hasSupabase ? fetchProducts('tour') : Promise.resolve(getProducts('tour')), [])
  let tours = (hasSupabase ? (live ?? []) : getProducts('tour')) as ReturnType<typeof getProducts>
  // live fetch via RLS already excludes archived for anon; extra filter for draft safety
  if (hasSupabase) tours = tours.filter(t => t.slug !== 'cape-town-walking-tour')
  if (sort === 'price') tours = [...tours].sort((a, b) => a.price - b.price)

  return (
    <div className="page">
      <Seo
        title="Tours — Western Cape"
        description={`Browse ${tours.length} guided Cape tours — Stellenbosch wine, Peninsula routes, whale watching and city walks. Local guides, pickup options, real reviews.`}
        canonical="/book/tours"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Cape Tours',
          numberOfItems: tours.length,
          itemListElement: tours.slice(0, 5).map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://www.capesee.com/book/tours/${t.slug}`,
            name: t.title,
          })),
        }}
      />
      <div className="row-between">
        <Link to="/book" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Tours</h1>
        <Button variant="outline" size="sm" onClick={filters.toggle}>
          {sort === 'price' ? 'Sort' : 'Filter'}
        </Button>
      </div>

      <p className="text-faint text-small" style={{ margin: '8px 0 14px' }}>
        Western Cape • Aug 14 • 2 guests {hasSupabase && loading ? '· syncing' : ''}
      </p>
      {loading ? <SkeletonCard lines={2} /> : null}
      <p className="bold text-small" style={{ marginBottom: 12 }}>
        {tours.length} experiences {hasSupabase ? '' : '· mock'}
      </p>

      <div className="stack" style={{ gap: 12 }}>
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      <FilterDrawer open={filters.open} onClose={filters.close}>
        <div className="col">
          <span className="label">Sort by</span>
          <div className="row wrap">
            {(
              [
                ['recommended', 'Recommended'],
                ['price', 'Lowest price'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                className={sort === key ? 'chip chip-active' : 'chip'}
                onClick={() => {
                  setSort(key)
                  filters.close()
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </FilterDrawer>
    </div>
  )
}
