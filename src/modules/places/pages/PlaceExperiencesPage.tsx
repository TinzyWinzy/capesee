import type { Place } from '@/types'
import { EmptyState, TourCard } from '@/components/ui'
import { mockTours } from '@/lib/mock'

/** Place experiences tab — bookable tours that visit this place. */
export function PlaceExperiencesPage({ place }: { place: Place }) {
  const tours = place.experienceCount > 0 ? mockTours.slice(0, place.experienceCount) : []

  if (tours.length === 0) {
    return <EmptyState icon="▤" title="No experiences here yet" description="Check back soon or browse all tours." />
  }

  return (
    <div className="stack" style={{ gap: 10 }}>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  )
}
