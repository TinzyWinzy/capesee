import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/modules/account/pages/NotificationsPage'

export const Route = createFileRoute('/_app/account/notifications')({ component: NotificationsPage })
