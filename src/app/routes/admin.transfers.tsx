import { createFileRoute } from '@tanstack/react-router'
import { AdminTransfersPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/transfers')({ component: AdminTransfersPage })
