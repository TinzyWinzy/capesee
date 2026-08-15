import { createFileRoute } from '@tanstack/react-router'
import { PlaceOverviewPage } from '@/modules/places/pages/PlaceOverviewPage'
import { getPlace } from '@/modules/places/api/places'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/discover/places/$placeSlug/')({
  component: function PlaceOverviewRoute() {
    const { placeSlug } = Route.useParams()
    const place = getPlace(placeSlug)
    if (!place) return <ErrorState message={`Place "${placeSlug}" was not found.`} />
    return <PlaceOverviewPage place={place} />
  },
})
