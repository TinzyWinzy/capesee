/** Core domain types for Capesee. These mirror the Supabase schema (see docs/supabase-api-contract.md). */

export type Role = 'traveler' | 'guide' | 'driver' | 'admin'

export interface User {
  id: string
  email?: string
  fullName: string
  role: Role
  phone?: string
  avatarUrl?: string
}

export type PinCategory = 'Wildlife' | 'History' | 'Food' | 'Other'
export type PinStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface Region {
  slug: string
  name: string
}

export interface Place {
  id: string
  slug: string
  name: string
  regionSlug: string
  type: string
  locationName: string
  coordinates: GeoPoint
  description: string
  rating: number
  verified: boolean
  timelineCount: number
  pinCount: number
  experienceCount: number
  sourceCount: number
  coverUrl?: string
}

export interface TimelineEvent {
  id: string
  placeId: string
  year: number
  title: string
  description: string
  kind: 'history' | 'traveler'
  sourceBacked: boolean
  confidence?: number
  status: string
}

export interface Pin {
  id: string
  placeId?: string
  authorName: string
  title: string
  description?: string
  category: PinCategory
  coordinates: GeoPoint
  createdAt: string
  status: PinStatus
  photoUrl?: string
  likes: number
  comments: number
}

export type BookableType = 'tour' | 'stay' | 'transfer' | 'experience'

export interface BookableProduct {
  id: string
  type: BookableType
  slug: string
  title: string
  price: number
  priceUnit: 'person' | 'night' | 'trip'
  rating: number
  reviewCount: number
  durationHours?: number
  regionSlug: string
  coverUrl?: string
  pickupIncluded?: boolean
  guideIncluded?: boolean
}

export interface CartItem {
  productId: string
  type: BookableType
  qty: number
  date?: string
}

export interface Booking {
  id: string
  code: string
  status: string
  total: number
  items: CartItem[]
  dates: { start: string; end: string }
  travelerId: string
  travelerName: string
  guideId?: string
  regionSlug: string
}

export interface Claim {
  id: string
  placeId: string
  placeName: string
  year: number
  summary: string
  confidence: number
  sourceAgreement: 'high' | 'medium' | 'low'
  sourceCount: number
  status: string
}

export interface HarvestSource {
  name: string
  url: string
  excerpt: string
  kind: 'heritage_authority' | 'wikipedia' | 'archive' | 'book' | 'academic'
}

export interface PastExperienceMedia {
  id: string
  experienceId: string
  kind: 'image' | 'video'
  url: string
  altText?: string
  sortOrder: number
}

export interface PastExperience {
  id: string
  providerId?: string
  placeId?: string
  productId?: string
  productSlug?: string
  productType?: BookableType
  placeSlug?: string
  placeName?: string
  title: string
  narrative: string
  occurredAt: string
  coverUrl?: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  media: PastExperienceMedia[]
}
