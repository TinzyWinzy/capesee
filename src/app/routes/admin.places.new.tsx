import { createFileRoute } from '@tanstack/react-router'
import { AdminPlaceEditorPage } from '@/modules/admin/pages/AdminPlacesPage'

export const Route = createFileRoute('/admin/places/new')({ component: AdminPlaceEditorPage })
