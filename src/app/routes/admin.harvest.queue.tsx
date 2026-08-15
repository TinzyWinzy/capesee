import { createFileRoute } from '@tanstack/react-router'
import { AdminHarvestQueuePage } from '@/modules/admin/pages/AdminHarvestQueuePage'

export const Route = createFileRoute('/admin/harvest/queue')({ component: AdminHarvestQueuePage })
