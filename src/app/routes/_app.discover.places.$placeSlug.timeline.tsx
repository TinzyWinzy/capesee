import { createFileRoute } from '@tanstack/react-router'
import { PlaceTimelinePage } from '@/modules/places/pages/PlaceTimelinePage'
import { getPlace } from '@/modules/places/api/places'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/discover/places/$placeSlug/timeline')({
  component: function PlaceTimelineRoute() {
    const { placeSlug } = Route.useParams()
    const place = getPlace(placeSlug)
    if (!place) return <ErrorState message={`Place "${placeSlug}" was not found.`} />
    return <PlaceTimelinePage place={place} />
  },
})
