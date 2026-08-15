import { createFileRoute } from '@tanstack/react-router'
import { AdminPlaceEditorPage } from '@/modules/admin/pages/AdminPlacesPage'

export const Route = createFileRoute('/admin/places/$placeId')({
  component: function AdminPlaceRoute() {
    const { placeId } = Route.useParams()
    return <AdminPlaceEditorPage placeId={placeId} />
  },
})
