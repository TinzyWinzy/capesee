import { createFileRoute } from '@tanstack/react-router'
import { RegionPage } from '@/modules/discover/pages/RegionPage'

export const Route = createFileRoute('/_app/discover/regions/$regionSlug')({
  component: function RegionDetailRoute() {
    const { regionSlug } = Route.useParams()
    return <RegionPage regionSlug={regionSlug} />
  },
})
