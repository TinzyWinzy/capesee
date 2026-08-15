import { createFileRoute } from '@tanstack/react-router'
import { GuideProfilePage } from '@/modules/guide/pages/GuideProfilePage'

export const Route = createFileRoute('/guide/profile')({ component: GuideProfilePage })
