import { createFileRoute } from '@tanstack/react-router'
import { AdminPlacesPage } from '@/modules/admin/pages/AdminPlacesPage'

export const Route = createFileRoute('/admin/places')({ component: AdminPlacesPage })
