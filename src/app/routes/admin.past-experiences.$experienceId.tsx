import { createFileRoute } from '@tanstack/react-router'
import { AdminPastExperienceEditorPage } from '@/modules/admin/pages/AdminPastExperienceEditorPage'

export const Route = createFileRoute('/admin/past-experiences/$experienceId')({
  component: function Cmp() {
    const { experienceId } = Route.useParams()
    return <AdminPastExperienceEditorPage experienceId={experienceId} />
  },
})
