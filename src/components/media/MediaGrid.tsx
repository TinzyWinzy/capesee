/** Responsive image/media grid, used by place media tab and admin media. */
export function MediaGrid({ items, onSelect }: { items: Array<{ id: string; label: string; url?: string; kind?: string }>; onSelect?: (id: string) => void }) {
  return (
    <div className="grid-3">
      {items.map((item) => (
        <button
          key={item.id}
          className="media ratio-4-3"
          style={{ border: 'none', cursor: onSelect ? 'pointer' : 'default', padding: 0, width: '100%' }}
          onClick={() => onSelect?.(item.id)}
        >
          {item.url ? (
            <img src={item.url} alt={item.label} />
          ) : (
            <span className="col" style={{ alignItems: 'center', gap: 2 }}>
              <span>{item.kind === 'video' ? '▶' : '◇'}</span>
              <span className="text-xs">{item.label}</span>
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
