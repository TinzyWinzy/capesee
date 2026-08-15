import { createFileRoute } from '@tanstack/react-router'
import { AdminBookingsPage } from '@/modules/admin/pages/AdminBookingsPage'

export const Route = createFileRoute('/admin/bookings')({ component: AdminBookingsPage })
