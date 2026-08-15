import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/modules/account/pages/SettingsPage'

export const Route = createFileRoute('/_app/account/settings')({ component: SettingsPage })
