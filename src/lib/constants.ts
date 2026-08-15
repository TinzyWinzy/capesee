/** Entity categories used by map markers and discovery filtering. */
export const CATEGORIES = [
  'Place',
  'Historical site',
  'Traveler discovery',
  'Tour',
  'Accommodation',
  'Food',
  'Wildlife',
  'Experience',
  'Event',
] as const

export const PIN_CATEGORIES = ['Wildlife', 'History', 'Food', 'Other'] as const

export const REGIONS = [
  { name: 'Western Cape', slug: 'western-cape' },
  { name: 'Eastern Cape', slug: 'eastern-cape' },
  { name: 'Northern Cape', slug: 'northern-cape' },
  { name: 'KwaZulu-Natal', slug: 'kwazulu-natal' },
] as const

/** Label sources — see spec §42. Public trust labels, not "AI generated". */
export const TRUST_LABELS = {
  travelerReport: 'Traveler Report',
  verified: 'Verified',
  historical: 'Historical Record',
  sourcesAvailable: 'Sources available',
} as const

export const DISCOVERY_STATUS = ['pending', 'approved', 'rejected', 'published'] as const
export const TIMELINE_STATUS = ['draft', 'needs_sources', 'conflict', 'approved', 'published'] as const
export const BOOKING_STATUS = ['pending', 'confirmed', 'completed', 'cancelled'] as const
