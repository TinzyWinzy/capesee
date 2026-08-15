import type { Booking, BookableProduct, Claim, HarvestSource, Pin, Place, TimelineEvent } from '@/types'

/**
 * Mock dataset for scaffold wireframes. Every screen that renders data today
 * reads from here; the module api/ files are the swap point for Supabase.
 */

export const mockPlaces: Place[] = [
  {
    id: 'p-castle',
    slug: 'castle-of-good-hope',
    name: 'Castle of Good Hope',
    regionSlug: 'western-cape',
    type: 'Historical Site',
    locationName: 'Cape Town',
    coordinates: { lat: -33.9259, lng: 18.4277 },
    description:
      'The oldest surviving colonial building in South Africa, a pentagonal fort built by the Dutch East India Company between 1666 and 1679.',
    rating: 4.7,
    verified: true,
    timelineCount: 17,
    pinCount: 46,
    experienceCount: 3,
    sourceCount: 6,
  },
  {
    id: 'p-kirstenbosch',
    slug: 'kirstenbosch',
    name: 'Kirstenbosch National Botanical Garden',
    regionSlug: 'western-cape',
    type: 'Nature',
    locationName: 'Cape Town',
    coordinates: { lat: -33.9877, lng: 18.4324 },
    description: 'A world-renowned botanical garden set against the eastern slopes of Table Mountain.',
    rating: 4.9,
    verified: true,
    timelineCount: 10,
    pinCount: 93,
    experienceCount: 2,
    sourceCount: 4,
  },
  {
    id: 'p-stellenbosch',
    slug: 'stellenbosch',
    name: 'Stellenbosch',
    regionSlug: 'western-cape',
    type: 'Town & Wine Region',
    locationName: 'Stellenbosch',
    coordinates: { lat: -33.9364, lng: 18.8616 },
    description: 'One of South Africa’s oldest towns, the centre of the Cape winelands.',
    rating: 4.6,
    verified: true,
    timelineCount: 8,
    pinCount: 40,
    experienceCount: 5,
    sourceCount: 3,
  },
  {
    id: 'p-hermanus',
    slug: 'hermanus',
    name: 'Hermanus',
    regionSlug: 'western-cape',
    type: 'Coastal Town',
    locationName: 'Hermanus',
    coordinates: { lat: -34.4187, lng: 19.2345 },
    description: 'Famous for land-based southern right whale watching between June and November.',
    rating: 4.8,
    verified: true,
    timelineCount: 4,
    pinCount: 27,
    experienceCount: 2,
    sourceCount: 2,
  },
]

export const mockTimeline: TimelineEvent[] = [
  { id: 't1', placeId: 'p-castle', year: 1666, title: 'Construction begins', description: 'The Dutch East India Company begins building the fort under Commander Zacharias Wagenaer.', kind: 'history', sourceBacked: true, status: 'published' },
  { id: 't2', placeId: 'p-castle', year: 1679, title: 'Castle completed', description: 'The pentagonal fortress is finished after 13 years of construction.', kind: 'history', sourceBacked: true, status: 'published' },
  { id: 't3', placeId: 'p-castle', year: 1936, title: 'Declared national monument', description: 'The Castle becomes one of South Africa’s first declared heritage sites.', kind: 'history', sourceBacked: true, status: 'published' },
  { id: 't4', placeId: 'p-castle', year: 2026, title: 'Rare bird spotted at the moat', description: 'A traveler photographed a juvenile heron near the west battery.', kind: 'traveler', sourceBacked: false, status: 'published' },
]

export const mockPins: Pin[] = [
  { id: 'pin-1', placeId: 'p-kirstenbosch', authorName: 'Thabo M.', title: 'Rare bird spotted', description: 'Heard the call before I saw it — malachite sunbird feeding on proteas.', category: 'Wildlife', coordinates: { lat: -33.987, lng: 18.431 }, createdAt: '2026-08-12T08:20:00Z', status: 'approved', likes: 12, comments: 3 },
  { id: 'pin-2', placeId: 'p-castle', authorName: 'Sofia R.', title: 'Restoration works visible', description: 'The west wall is being repointed. Fascinating to watch.', category: 'History', coordinates: { lat: -33.9261, lng: 18.4271 }, createdAt: '2026-08-11T15:40:00Z', status: 'approved', likes: 8, comments: 1 },
  { id: 'pin-3', placeId: 'p-hermanus', authorName: 'James K.', title: 'Whale breach at the cliffs', description: 'Southern right whale breached twice off Gearing’s Point.', category: 'Wildlife', coordinates: { lat: -34.4217, lng: 19.2371 }, createdAt: '2026-08-12T07:10:00Z', status: 'pending', likes: 0, comments: 0 },
]

export const mockTours: BookableProduct[] = [
  { id: 'tour-1', type: 'tour', slug: 'stellenbosch-wine-experience', title: 'Stellenbosch Wine Experience', price: 1250, priceUnit: 'person', rating: 4.9, reviewCount: 220, durationHours: 8, regionSlug: 'western-cape', pickupIncluded: true, guideIncluded: true },
  { id: 'tour-2', type: 'tour', slug: 'cape-peninsula-tour', title: 'Cape Peninsula Tour', price: 950, priceUnit: 'person', rating: 4.8, reviewCount: 310, durationHours: 9, regionSlug: 'western-cape', pickupIncluded: true, guideIncluded: true },
  { id: 'tour-3', type: 'tour', slug: 'cape-town-walking-tour', title: 'Cape Town Walking Tour', price: 450, priceUnit: 'person', rating: 4.7, reviewCount: 96, durationHours: 3, regionSlug: 'western-cape', pickupIncluded: false, guideIncluded: true },
  { id: 'tour-4', type: 'tour', slug: 'hermanus-whale-watching', title: 'Hermanus Whale Watching', price: 880, priceUnit: 'person', rating: 4.9, reviewCount: 140, durationHours: 4, regionSlug: 'western-cape', pickupIncluded: true, guideIncluded: true },
]

export const mockStays: BookableProduct[] = [
  { id: 'stay-1', type: 'stay', slug: 'cape-lodge', title: 'Cape Lodge', price: 1600, priceUnit: 'night', rating: 4.5, reviewCount: 78, regionSlug: 'western-cape' },
  { id: 'stay-2', type: 'stay', slug: 'winelands-villa', title: 'Winelands Villa', price: 2400, priceUnit: 'night', rating: 4.8, reviewCount: 41, regionSlug: 'western-cape' },
]

export const mockTransfers: BookableProduct[] = [
  { id: 'tr-1', type: 'transfer', slug: 'airport-to-cape-town', title: 'Airport → Cape Town', price: 600, priceUnit: 'trip', rating: 4.6, reviewCount: 120, regionSlug: 'western-cape' },
]

export const mockExperiences: BookableProduct[] = [
  { id: 'exp-1', type: 'experience', slug: 'cape-town-sunset-sail', title: 'Cape Town Sunset Sail', price: 720, priceUnit: 'person', rating: 4.9, reviewCount: 58, durationHours: 3, regionSlug: 'western-cape' },
]

export const mockBookings: Booking[] = [
  {
    id: 'b-1',
    code: 'CAP-24841',
    status: 'confirmed',
    total: 6300,
    items: [
      { productId: 'tour-1', type: 'tour', qty: 2 },
      { productId: 'stay-1', type: 'stay', qty: 2 },
      { productId: 'tr-1', type: 'transfer', qty: 1 },
    ],
    dates: { start: '2026-08-14', end: '2026-08-17' },
    travelerId: 'dev-traveler',
    travelerName: 'Tinotenda',
    regionSlug: 'western-cape',
  },
  {
    id: 'b-2',
    code: 'CAP-24790',
    status: 'completed',
    total: 1900,
    items: [{ productId: 'tour-3', type: 'tour', qty: 2 }],
    dates: { start: '2026-07-02', end: '2026-07-02' },
    travelerId: 'dev-traveler',
    travelerName: 'Tinotenda',
    regionSlug: 'western-cape',
  },
]

export const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    placeId: 'p-castle',
    placeName: 'Castle of Good Hope',
    year: 1666,
    summary: 'Construction of the Castle of Good Hope began in 1666 under the Dutch East India Company and took 13 years to complete.',
    confidence: 92,
    sourceAgreement: 'high',
    sourceCount: 3,
    status: 'awaiting_review',
  },
  {
    id: 'claim-2',
    placeId: 'p-kirstenbosch',
    placeName: 'Kirstenbosch National Botanical Garden',
    year: 1913,
    summary: 'Kirstenbosch was established in 1913 to preserve the Cape flora, making it the first botanical garden in the world dedicated to a region’s indigenous flora.',
    confidence: 78,
    sourceAgreement: 'medium',
    sourceCount: 2,
    status: 'needs_sources',
  },
]

export const mockSources: HarvestSource[] = [
  { name: 'South African Heritage Resources Agency', url: 'https://example.com/sahra/castle', excerpt: 'The Castle of Good Hope, built between 1666 and 1679, is the oldest surviving colonial building in South Africa.', kind: 'heritage_authority' },
  { name: 'Wikipedia — Castle of Good Hope', url: 'https://en.wikipedia.org/wiki/Castle_of_Good_Hope', excerpt: 'Construction of the castle began on 2 January 1666...', kind: 'wikipedia' },
  { name: 'Cape Archives — construction ledger', url: 'https://example.com/archive/ledger-1666', excerpt: 'Ledger entries record stone deliveries to the fortification site from 1666.', kind: 'archive' },
]

export function getPlaceBySlug(slug: string): Place | undefined {
  return mockPlaces.find((p) => p.slug === slug)
}

export function getPlaceById(id: string): Place | undefined {
  return mockPlaces.find((p) => p.id === id)
}

export function getProductBySlug(type: 'tour' | 'stay' | 'transfer' | 'experience', slug: string): BookableProduct | undefined {
  const all = [...mockTours, ...mockStays, ...mockTransfers, ...mockExperiences]
  return all.find((p) => p.type === type && p.slug === slug)
}

export function getPinById(id: string): Pin | undefined {
  return mockPins.find((p) => p.id === id)
}
