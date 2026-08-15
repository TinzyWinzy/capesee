import { createFileRoute } from '@tanstack/react-router'
import { CatalogDetailPage } from '@/modules/bookings/pages/CatalogPages'

export const Route = createFileRoute('/_app/book/experiences/$experienceSlug')({
  component: function ExperienceDetailRoute() {
    const { experienceSlug } = Route.useParams()
    return <CatalogDetailPage type="experience" slug={experienceSlug} />
  },
})
