import { createFileRoute } from '@tanstack/react-router'
import { PlaceHeader } from '@/modules/places/components/PlaceHeader'
import { getPlace } from '@/modules/places/api/places'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/discover/places/$placeSlug')({
  component: function PlaceDetailRoute() {
    const { placeSlug } = Route.useParams()
    const place = getPlace(placeSlug)
    if (!place) return <ErrorState message={`Place "${placeSlug}" was not found.`} />
    return <PlaceHeader place={place} />
  },
})
