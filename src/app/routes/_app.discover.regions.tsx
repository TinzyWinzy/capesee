import { createFileRoute } from '@tanstack/react-router'
import { RegionListPage } from '@/modules/discover/pages/RegionPage'

export const Route = createFileRoute('/_app/discover/regions')({
  component: RegionListPage,
})
