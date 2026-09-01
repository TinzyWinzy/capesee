import type { PastExperience } from '@/types'

export const mockPastExperiences: PastExperience[] = [
  {
    id: 'pe-1',
    title: 'Sunset sail from the Waterfront — a perfect evening',
    narrative: 'We joined the sunset sail at 17:30. The Atlantic was calm, Table Mountain glowing pink. The crew shared stories of the harbour — from the 1860 Alfred Basin to today. Guests spotted dolphins off Green Point. Unforgettable.',
    occurredAt: '2026-08-20',
    placeId: undefined,
    productId: 'exp-1',
    productSlug: 'cape-town-sunset-sail',
    productType: 'experience',
    placeSlug: 'va-waterfront',
    placeName: 'Victoria & Alfred Waterfront',
    coverUrl: '/images/IMG-20260823-WA0119.jpg',
    status: 'published',
    createdAt: '2026-08-22T10:00:00Z',
    media: [
      { id: 'pem-1', experienceId: 'pe-1', kind: 'image', url: '/images/IMG-20260823-WA0119.jpg', sortOrder: 0 },
      { id: 'pem-2', experienceId: 'pe-1', kind: 'image', url: '/images/IMG-20260823-WA0141.jpg', sortOrder: 1 },
    ]
  },
  {
    id: 'pe-2',
    title: 'Stellenbosch in winter — wine, fireplaces and old oaks',
    narrative: 'A full-day wine experience in Stellenbosch. Tokara’s orchard walk, then tasting at a family estate from 1688. The guide linked every stop to place — even the Huguenot story.',
    occurredAt: '2026-08-10',
    productId: 'tour-1',
    productSlug: 'stellenbosch-wine-experience',
    productType: 'tour',
    placeSlug: 'stellenbosch',
    placeName: 'Stellenbosch',
    coverUrl: '/images/IMG-20260823-WA0179.jpg',
    status: 'published',
    createdAt: '2026-08-12T10:00:00Z',
    media: []
  },
]
