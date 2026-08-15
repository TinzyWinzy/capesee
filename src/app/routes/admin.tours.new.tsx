import { createFileRoute } from '@tanstack/react-router'
import { AdminTourEditorPage } from '@/modules/admin/pages/AdminTourEditorPage'

export const Route = createFileRoute('/admin/tours/new')({ component: AdminTourEditorPage })
