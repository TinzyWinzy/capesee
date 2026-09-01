import { createFileRoute } from '@tanstack/react-router'
import { AdminPastExperiencesPage } from '@/modules/admin/pages/AdminPastExperiencesPage'

export const Route = createFileRoute('/admin/past-experiences')({ component: AdminPastExperiencesPage })
