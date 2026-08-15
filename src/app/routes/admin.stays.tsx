import { createFileRoute } from '@tanstack/react-router'
import { AdminStaysPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/stays')({ component: AdminStaysPage })
