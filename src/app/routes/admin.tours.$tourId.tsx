import { createFileRoute } from '@tanstack/react-router'
import { AdminTourEditorPage } from '@/modules/admin/pages/AdminTourEditorPage'

export const Route = createFileRoute('/admin/tours/$tourId')({
  component: function AdminTourRoute() {
    const { tourId } = Route.useParams()
    return <AdminTourEditorPage tourId={tourId} />
  },
})
