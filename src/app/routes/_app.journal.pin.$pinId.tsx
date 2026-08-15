import { createFileRoute } from '@tanstack/react-router'
import { PinDetailPage } from '@/modules/journal/pages/PinDetailPage'
import { getPin } from '@/modules/journal/api/journal'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/journal/pin/$pinId')({
  component: function PinDetailRoute() {
    const { pinId } = Route.useParams()
    const pin = getPin(pinId)
    if (!pin) return <ErrorState message={`Discovery ${pinId} was not found.`} />
    return <PinDetailPage pin={pin} />
  },
})
