import { createFileRoute } from '@tanstack/react-router'
import { AdminGuidesPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/guides')({ component: AdminGuidesPage })
