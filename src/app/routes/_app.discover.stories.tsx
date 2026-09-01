import { createFileRoute } from '@tanstack/react-router'
import { StoriesFeedPage } from '@/modules/pastExperiences/pages/StoriesFeedPage'

export const Route = createFileRoute('/_app/discover/stories')({ component: StoriesFeedPage })
