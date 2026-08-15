import { createFileRoute } from '@tanstack/react-router'
import { AdminPaymentsPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/payments')({ component: AdminPaymentsPage })
