import { createFileRoute } from '@tanstack/react-router'
import { GuideCheckInPage } from '@/modules/guide/pages/GuideCheckInPage'

export const Route = createFileRoute('/guide/check-in')({ component: GuideCheckInPage })
