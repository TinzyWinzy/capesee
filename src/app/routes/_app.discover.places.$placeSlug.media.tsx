import { createFileRoute } from '@tanstack/react-router'
import { PlaceMediaPage } from '@/modules/places/pages/PlaceMediaPage'
import { getPlace } from '@/modules/places/api/places'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/discover/places/$placeSlug/media')({
  component: function PlaceMediaRoute() {
    const { placeSlug } = Route.useParams()
    const place = getPlace(placeSlug)
    if (!place) return <ErrorState message={`Place "${placeSlug}" was not found.`} />
    return <PlaceMediaPage place={place} />
  },
})
