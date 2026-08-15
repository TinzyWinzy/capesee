import { createFileRoute } from '@tanstack/react-router'
import { DiscoverHomePage } from '@/modules/discover/pages/DiscoverHomePage'

export const Route = createFileRoute('/_app/discover/')({ component: DiscoverHomePage })
