import { Link } from '@tanstack/react-router'
import type { Region } from '@/types'
import { Card } from '.'

export function RegionCard({ region, stat }: { region: Region; stat?: string }) {
  return (
    <Link to="/discover/regions/$regionSlug" params={{ regionSlug: region.slug }}>
      <Card className="card-link">
        <div className="eyebrow">Region</div>
        <div className="section-title">{region.name}</div>
        {stat ? <span className="text-faint text-xs">{stat}</span> : null}
      </Card>
    </Link>
  )
}
