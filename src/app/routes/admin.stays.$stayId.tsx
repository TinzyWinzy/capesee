import { createFileRoute } from '@tanstack/react-router'
import { AdminStayEditorPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/stays/$stayId')({
  component: function StayEditorRoute() {
    const { stayId } = Route.useParams()
    return <AdminStayEditorPage stayId={stayId} />
  },
})
