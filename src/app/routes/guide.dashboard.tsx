import { createFileRoute } from '@tanstack/react-router'
import { GuideDashboardPage } from '@/modules/guide/pages/GuideDashboardPage'

export const Route = createFileRoute('/guide/dashboard')({ component: GuideDashboardPage })
