import { createFileRoute } from '@tanstack/react-router'
import { AdminPastExperienceEditorPage } from '@/modules/admin/pages/AdminPastExperienceEditorPage'

export const Route = createFileRoute('/admin/past-experiences/new')({ component: () => <AdminPastExperienceEditorPage experienceId="new" /> })
