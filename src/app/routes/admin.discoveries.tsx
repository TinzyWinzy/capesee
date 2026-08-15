import { createFileRoute } from '@tanstack/react-router'
import { AdminDiscoveryModerationPage } from '@/modules/admin/pages/AdminDiscoveryModerationPage'

export const Route = createFileRoute('/admin/discoveries')({ component: AdminDiscoveryModerationPage })
