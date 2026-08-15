import { createFileRoute } from '@tanstack/react-router'
import { AdminToursPage } from '@/modules/admin/pages/AdminToursPage'

export const Route = createFileRoute('/admin/tours')({ component: AdminToursPage })
