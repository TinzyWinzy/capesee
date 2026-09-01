import { createFileRoute } from '@tanstack/react-router'
import { StoryDetailPage } from '@/modules/pastExperiences/pages/StoriesFeedPage'

export const Route = createFileRoute('/_app/discover/stories/$storyId')({
  component: function Cmp() {
    const { storyId } = Route.useParams()
    return <StoryDetailPage storyId={storyId} />
  },
})
