import { createFileRoute } from '@tanstack/react-router'
import { AdminTimelinePage } from '@/modules/admin/pages/AdminTimelinePage'

export const Route = createFileRoute('/admin/timeline')({ component: AdminTimelinePage })
