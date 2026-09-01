import { Link } from '@tanstack/react-router'
import { Badge, Card, EmptyState, SkeletonCard } from '@/components/ui'
import { formatDate } from '@/lib/format'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchPastExperiences } from '@/modules/pastExperiences/api/pastExperiences'

export function AdminPastExperiencesPage() {
  const { data, loading, error } = useAsyncData(() => fetchPastExperiences(false), [])

  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Past Experiences</h1>
        <Link to="/admin/past-experiences/new" className="btn btn-primary btn-sm">+ New Story</Link>
      </div>
      <p className="text-faint text-small">Client storytelling engine — past tours published as stories, optionally linked to a bookable product.</p>

      {error ? <p className="alert alert-error">{error.message}</p> : null}
      {loading ? <SkeletonCard lines={6} /> : null}
      {!loading && !error && (data ?? []).length === 0 ? (
        <EmptyState icon="◇" title="No stories yet" description="Create the first past experience — a completed tour as a story." />
      ) : null}
      {!loading && data && data.length > 0 ? (
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Date</th><th>Place</th><th>Linked product</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {data.map(pe=> (
              <tr key={pe.id}>
                <td className="bold text-small">{pe.title}</td>
                <td>{formatDate(pe.occurredAt)}</td>
                <td>{pe.placeName ?? '—'}</td>
                <td>{pe.productSlug ? <Badge tone="info">{pe.productType} · {pe.productSlug}</Badge> : '—'}</td>
                <td><Badge tone={pe.status==='published'?'success':'default'}>{pe.status}</Badge></td>
                <td className="text-right"><Link to="/admin/past-experiences/$experienceId" params={{ experienceId: pe.id }} className="btn btn-outline btn-sm">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {!loading && data && data.length>0 ? (
        <Card><span className="eyebrow">Tip</span><p className="text-small">Stories with product link show “Book this experience” on the public story page.</p></Card>
      ) : null}
    </div>
  )
}
