/**
 * Analytics stub. The critical Capesee metric is DISCOVERY-ASSISTED BOOKING
 * RATE (§36). Track discovery → booking paths now so the pipeline has data
 * when production logging lands (Sprint 5+).
 */
export type AnalyticsEvent =
  | { name: 'place_view'; placeSlug: string }
  | { name: 'discovery_view'; pinId: string }
  | { name: 'timeline_view'; placeSlug: string }
  | { name: 'map_open' }
  | { name: 'booking_created'; bookingCode: string; assistedByDiscovery: boolean }
  | { name: 'search'; q: string; results: number }

export function track(event: AnalyticsEvent): void {
  // Dev no-op. Swap for a provider (PostHog / GA4 / BigQuery) when wired.
  if (import.meta.env.DEV) console.debug('[analytics]', event)
}
