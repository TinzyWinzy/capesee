import { createFileRoute } from '@tanstack/react-router'
import { PlaceDiscoveriesPage } from '@/modules/places/pages/PlaceDiscoveriesPage'
import { getPlace } from '@/modules/places/api/places'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/discover/places/$placeSlug/discoveries')({
  component: function PlaceDiscoveriesRoute() {
    const { placeSlug } = Route.useParams()
    const place = getPlace(placeSlug)
    if (!place) return <ErrorState message={`Place "${placeSlug}" was not found.`} />
    return <PlaceDiscoveriesPage place={place} />
  },
})
