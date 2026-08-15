import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardPage } from '@/modules/admin/pages/AdminDashboardPage'

export const Route = createFileRoute('/admin/dashboard')({ component: AdminDashboardPage })
