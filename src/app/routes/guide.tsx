import { createFileRoute } from '@tanstack/react-router'
import { GuideLayout } from '@/app/layouts/GuideLayout'
import { requireGuide } from '@/app/router/guards'

export const Route = createFileRoute('/guide')({ beforeLoad: requireGuide, component: GuideLayout })
