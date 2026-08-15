import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, FilterDrawer, TourCard, useFilterDrawer } from '@/components/ui'
import { getProducts } from '@/modules/bookings/api/products'

/** T10 — Tour search results. Wireframe spec §12. */
export function TourResultsPage() {
  const [sort, setSort] = useState<'recommended' | 'price'>('recommended')
  const filters = useFilterDrawer()
  let tours = getProducts('tour')
  if (sort === 'price') tours = [...tours].sort((a, b) => a.price - b.price)

  return (
    <div className="page">
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
        Western Cape • Aug 14 • 2 guests
      </p>
      <p className="bold text-small" style={{ marginBottom: 12 }}>
        {tours.length} experiences
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
