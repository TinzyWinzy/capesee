import { Link } from '@tanstack/react-router'
import { Badge, Card, SkeletonCard } from '@/components/ui'
import { formatDate } from '@/lib/format'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchPastExperiences } from '@/modules/pastExperiences/api/pastExperiences'

export function StoriesFeedPage() {
  const { data, loading, error } = useAsyncData(() => fetchPastExperiences(true), [])
  const stories = data ?? []

  return (
    <main className="page-narrow" style={{ maxWidth: 900 }}>
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="section-title">Past Experiences — Stories from the field</h1>
          <p className="text-faint text-small">Tours lived, then told. Each story is linked to place and, when relevant, the bookable product it came from.</p>
        </div>
        <Link to="/discover" className="btn btn-ghost btn-sm">← Discover</Link>
      </div>
      {error ? <p className="alert alert-error">{error.message}</p> : null}
      {loading ? <SkeletonCard lines={6} /> : null}
      {!loading && stories.length===0 ? (
        <Card><p className="text-faint">No stories published yet. Check the gallery for field captures in the meantime.</p></Card>
      ) : null}
      <div className="stack">
        {stories.map(s=> (
          <Link key={s.id} to="/discover/stories/$storyId" params={{ storyId: s.id }} className="card row" style={{ gap: 16, textDecoration: 'none' }}>
            {s.coverUrl ? <img src={s.coverUrl} alt={s.title} style={{ width: 180, height: 120, objectFit:'cover', borderRadius:8 }} loading="lazy" /> : <div style={{width:180,height:120,background:'var(--color-line)',borderRadius:8}}/>}
            <div className="stack" style={{ gap: 6, flex:1 }}>
              <div className="row wrap" style={{ gap: 6 }}>
                <Badge tone="default">{formatDate(s.occurredAt)}</Badge>
                {s.placeName ? <Badge tone="info">{s.placeName}</Badge> : null}
                {s.productSlug ? <Badge tone="success">From: {s.productSlug}</Badge> : null}
              </div>
              <span className="bold">{s.title}</span>
              <p className="text-small text-faint" style={{ display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{s.narrative}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export function StoryDetailPage({ storyId }: { storyId: string }) {
  const { data: story, loading, error } = useAsyncData(() => fetchPastExperiences(true).then(all=> all.find(s=>s.id===storyId)), [storyId])

  if (loading) return <main className="page-narrow"><SkeletonCard lines={8}/></main>
  if (error) return <main className="page-narrow"><p className="alert alert-error">{error.message}</p></main>
  if (!story) return <main className="page-narrow"><p className="alert">Story not found.</p><Link to="/discover/stories" className="btn btn-outline">Back to stories</Link></main>

  const bookLink = story.productSlug && story.productType ? (() => {
    const typeMap: Record<string,string> = { tour:'tours', stay:'stays', experience:'experiences', transfer:'transfers' }
    const seg = typeMap[story.productType] ?? 'tours'
    return `/book/${seg}/${story.productSlug}`
  })() : null

  return (
    <main className="page-narrow" style={{ maxWidth: 860 }}>
      <Link to="/discover/stories" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>← All stories</Link>
      {story.coverUrl ? <img src={story.coverUrl} alt={story.title} style={{ width:'100%', maxHeight: 420, objectFit:'cover', borderRadius:12 }} /> : null}
      <h1 className="section-title" style={{ marginTop: 16 }}>{story.title}</h1>
      <div className="row wrap" style={{ gap: 6, marginBottom: 12 }}>
        <Badge>{formatDate(story.occurredAt)}</Badge>
        {story.placeName ? <Link to="/discover/places/$placeSlug" params={{ placeSlug: story.placeSlug ?? '' } as any} className="badge badge-info">{story.placeName}</Link> : null}
        {story.productSlug ? <Badge tone="success">Linked to {story.productType}</Badge> : null}
      </div>
      <Card className="stack">
        <p style={{ whiteSpace:'pre-wrap', lineHeight:1.6 }}>{story.narrative}</p>
      </Card>
      {story.media.length>0 ? (
        <div className="grid-2" style={{ marginTop: 16 }}>
          {story.media.map(m=> m.kind==='video' ? (
            <video key={m.id} src={m.url} controls style={{ width:'100%', borderRadius:8 }} />
          ) : (
            <img key={m.id} src={m.url} alt={m.altText ?? story.title} style={{ width:'100%', borderRadius:8 }} loading="lazy" />
          ))}
        </div>
      ) : null}
      {bookLink ? (
        <Card style={{ marginTop: 16 }} className="row-between">
          <div><span className="eyebrow">Bookable from this story</span><p className="bold text-small">{story.productSlug}</p></div>
          <Link to={bookLink as any} className="btn btn-primary">Book this experience</Link>
        </Card>
      ) : null}
    </main>
  )
}
