/** Cluster bubble showing how many entities share an area. */
export function MapCluster({ count, x, y, onClick }: { count: number; x: number; y: number; onClick?: () => void }) {
  return (
    <button type="button" className="map-cluster" style={{ left: `${x}%`, top: `${y}%` }} onClick={onClick} aria-label={`Explore ${count} nearby places`}>
      {count}
    </button>
  )
}
