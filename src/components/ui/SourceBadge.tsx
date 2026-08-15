import { Badge } from './Badge'

/** Trust label for history with evidence. See spec §42. */
export function SourceBadge({ count }: { count?: number }) {
  return <Badge tone="info">{count ? `Sources: ${count}` : 'Sources available'}</Badge>
}
