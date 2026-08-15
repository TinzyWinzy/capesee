import { createFileRoute } from '@tanstack/react-router'
import { AdminMediaPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/media')({ component: AdminMediaPage })
