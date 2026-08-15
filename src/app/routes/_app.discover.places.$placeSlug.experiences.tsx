import { createFileRoute } from '@tanstack/react-router'
import { PlaceExperiencesPage } from '@/modules/places/pages/PlaceExperiencesPage'
import { getPlace } from '@/modules/places/api/places'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/discover/places/$placeSlug/experiences')({
  component: function PlaceExperiencesRoute() {
    const { placeSlug } = Route.useParams()
    const place = getPlace(placeSlug)
    if (!place) return <ErrorState message={`Place "${placeSlug}" was not found.`} />
    return <PlaceExperiencesPage place={place} />
  },
})
