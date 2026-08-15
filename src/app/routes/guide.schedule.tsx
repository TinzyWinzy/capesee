import { createFileRoute } from '@tanstack/react-router'
import { GuideSchedulePage } from '@/modules/guide/pages/GuideSchedulePage'

export const Route = createFileRoute('/guide/schedule')({ component: GuideSchedulePage })
