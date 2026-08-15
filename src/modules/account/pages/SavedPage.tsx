import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { EmptyState, ErrorState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchMySavedPlaces, removeSavedPlace } from '@/modules/account/api/account'

export function SavedPage() {
  const { data, error, loading } = useAsyncData(() => fetchMySavedPlaces(), [])
  const [removing, setRemoving] = useState<string>()
  const [savedPlaces, setSavedPlaces] = useState<NonNullable<typeof data>>()

  const places = savedPlaces ?? data

  const remove = async (placeId: string) => {
    setRemoving(placeId)
    try {
      await removeSavedPlace(placeId)
      setSavedPlaces((current) => (current ?? data ?? []).filter((p) => p.placeId !== placeId))
    } finally {
      setRemoving(undefined)
    }
  }

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Saved
      </h1>

      {loading ? <SkeletonCard lines={2} /> : null}
      {error ? <ErrorState message={error.message} /> : null}

      {!loading && !error && places === null ? (
        <EmptyState
          icon="♡"
          title="Connect Supabase to see saved places"
          description="Places you save appear here so you can find them again — and get notified when their history grows."
        />
      ) : null}

      {!loading && !error && places && places.length === 0 ? (
        <EmptyState
          icon="♡"
          title="Nothing saved yet"
          description="Tap the heart on any place to keep it here."
          action={
            <Link to="/discover/places" className="btn btn-primary btn-sm">
              Explore places
            </Link>
          }
        />
      ) : null}

      {!loading && !error && places && places.length > 0 ? (
        <div className="stack">
          {places.map((place) => (
            <div key={place.placeId} className="card row-between">
              <div>
                <Link to="/discover/places/$placeSlug" params={{ placeSlug: place.slug }} className="bold text-small">
                  {place.name}
                </Link>
                <div className="text-faint text-xs">
                  {place.locationName} · {place.type}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={removing === place.placeId}
                onClick={() => void remove(place.placeId)}
              >
                {removing === place.placeId ? 'Removing…' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
