import { createFileRoute } from '@tanstack/react-router'
import { AdminCustomersPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/customers')({ component: AdminCustomersPage })
