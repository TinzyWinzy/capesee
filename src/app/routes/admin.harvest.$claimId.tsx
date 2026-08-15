import { createFileRoute } from '@tanstack/react-router'
import { AdminHarvestEvidencePage } from '@/modules/admin/pages/AdminHarvestEvidencePage'

export const Route = createFileRoute('/admin/harvest/$claimId')({
  component: function HarvestEvidenceRoute() {
    const { claimId } = Route.useParams()
    return <AdminHarvestEvidencePage claimId={claimId} />
  },
})
