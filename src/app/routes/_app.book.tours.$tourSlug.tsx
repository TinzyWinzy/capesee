import { createFileRoute } from '@tanstack/react-router'
import { TourDetailPage } from '@/modules/bookings/pages/TourDetailPage'
import { getProduct } from '@/modules/bookings/api/products'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/book/tours/$tourSlug')({
  component: function TourDetailRoute() {
    const { tourSlug } = Route.useParams()
    const tour = getProduct('tour', tourSlug)
    if (!tour) return <ErrorState message={`Tour "${tourSlug}" was not found.`} />
    return <TourDetailPage tour={tour} />
  },
})
