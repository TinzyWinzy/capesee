import { createFileRoute } from '@tanstack/react-router'
import { AdminSettingsPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/settings')({ component: AdminSettingsPage })
