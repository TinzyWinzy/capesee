import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/ui'

export const Route = createFileRoute('/admin/stays/$stayId')({
  component: function StayEditorRoute() {
    const { stayId } = Route.useParams()
    return <PlaceholderPage title="Stay editor" description={`Inventory editor for ${stayId}.`} />
  },
})
