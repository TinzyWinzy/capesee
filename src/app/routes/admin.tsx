import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { requireAdmin } from '@/app/router/guards'

export const Route = createFileRoute('/admin')({ beforeLoad: requireAdmin, component: AdminLayout })
