import { createFileRoute } from '@tanstack/react-router'
import { SavedPage } from '@/modules/account/pages/SavedPage'

export const Route = createFileRoute('/_app/account/saved')({ component: SavedPage })
