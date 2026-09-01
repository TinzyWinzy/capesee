import { createFileRoute } from '@tanstack/react-router'
import { GalleryPage } from '@/modules/discover/pages/GalleryPage'

export const Route = createFileRoute('/_app/discover/gallery')({ component: GalleryPage })
