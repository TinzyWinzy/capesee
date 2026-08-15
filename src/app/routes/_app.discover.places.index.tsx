import { createFileRoute } from '@tanstack/react-router'
import { PlacesListPage } from '@/modules/places/pages/PlacesListPage'

export const Route = createFileRoute('/_app/discover/places/')({ component: PlacesListPage })
