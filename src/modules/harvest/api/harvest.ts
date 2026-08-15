import type { Claim, HarvestSource } from '@/types'
import { mockClaims, mockSources } from '@/lib/mock'

/**
 * Harvest intelligence (A07–A08). Internal admin only.
 * TODO(Sprint 4): claim generation pipeline, evidence graph, source
 * agreement scoring, approve/reject mutations.
 */
export function getClaims(status?: string): Claim[] {
  return status ? mockClaims.filter((c) => c.status === status) : mockClaims
}

export function getClaim(id: string): Claim | undefined {
  return mockClaims.find((c) => c.id === id)
}

export function getSourcesForClaim(claimId: string): HarvestSource[] {
  void claimId
  return mockSources
}
