import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '@/modules/account/pages/PrivacyPage'

export const Route = createFileRoute('/_app/account/privacy')({ component: PrivacyPage })
