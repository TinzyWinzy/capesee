/** Animated pillar icons — pure SVG + CSS, no deps. Respects prefers-reduced-motion. */

export function IconWinePour({ animate = true }: { animate?: boolean }) {
  return (
    <span className={`pillar-icon pillar-icon--wine${animate ? ' is-animated' : ''}`} aria-hidden>
      <svg viewBox="0 0 56 56" width={56} height={56} fill="none">
        {/* bottle */}
        <g className="wine-bottle">
          {/* bottle body */}
          <path d="M22 8 L22 18 Q22 21 20 23 L18 26 L26 26 L24 23 Q22 21 22 18 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M18 26 H26 L26 28 Q26 30 24 30 H20 Q18 30 18 28 Z" fill="currentColor" opacity={0.95} />
          {/* label */}
          <rect x="19.2" y="14.5" width={5.6} height={6} rx={0.6} fill="var(--color-brass)" opacity={0.95} />
          {/* cork highlight */}
          <rect x="21" y="8" width={2} height={2.5} rx={0.4} fill="currentColor" opacity={0.3} />
        </g>
        {/* pour stream */}
        <path className="wine-stream" d="M19 28 C18 33 19.5 37 20.8 41.5" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" opacity={0.9} />
        <path className="wine-stream wine-stream--2" d="M20.5 30 C19.2 34.5 20 38.5 21.4 42" stroke="#e67e5a" strokeWidth="1.1" strokeLinecap="round" opacity={0.55} />
        {/* droplets */}
        <circle className="wine-drop" cx="21.2" cy="38" r="1.1" fill="#c0392b" />
        <circle className="wine-drop wine-drop--2" cx="20" cy="34" r="0.7" fill="#c0392b" opacity={0.7} />
        {/* glass */}
        <g className="wine-glass">
          <path d="M30 22 L30 38 Q30 42 36 42 Q42 42 42 38 L42 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M36 42 L36 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M31 47 H41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* wine fill */}
          <path className="wine-fill" d="M31 36 Q36 37.5 41 36 L41 38 Q41 42 36 42 Q30 42 30 38 Z" fill="#8b2230" opacity={0.92} />
          {/* highlight */}
          <path d="M32.5 26 L32.5 34" stroke="white" strokeWidth="1" opacity={0.18} strokeLinecap="round" />
          {/* surface shimmer */}
          <ellipse className="wine-shimmer" cx="36" cy="36" rx="4.5" ry="1" fill="white" opacity={0.14} />
        </g>
        {/* sparkle on pour */}
        <g className="wine-sparkle" fill="var(--color-brass)">
          <circle cx="17" cy="18" r="0.9" />
          <circle cx="27.5" cy="20" r="0.6" />
        </g>
      </svg>
    </span>
  )
}

export function IconCompass({ animate = true }: { animate?: boolean }) {
  return (
    <span className={`pillar-icon pillar-icon--compass${animate ? ' is-animated' : ''}`} aria-hidden>
      <svg viewBox="0 0 56 56" width={56} height={56} fill="none">
        {/* outer ring */}
        <circle cx="28" cy="28" r="18.5" stroke="currentColor" strokeWidth="1.4" opacity={0.95} />
        <circle cx="28" cy="28" r="14.5" stroke="currentColor" strokeWidth="0.9" opacity={0.18} />
        {/* cardinal ticks */}
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity={0.9}>
          <path d="M28 9.5 L28 13.5" />
          <path d="M28 42.5 L28 46.5" />
          <path d="M9.5 28 L13.5 28" />
          <path d="M42.5 28 L46.5 28" />
        </g>
        <g stroke="currentColor" strokeWidth="0.9" opacity={0.35}>
          <path d="M15 15 L17 17" />
          <path d="M39 15 L41 17" />
          <path d="M15 41 L17 39" />
          <path d="M39 41 L41 39" />
        </g>
        {/* N label */}
        <text x="28" y="11.2" textAnchor="middle" fontSize="5" fontWeight={800} fill="var(--color-flame)" fontFamily="var(--font-mono)">N</text>
        {/* needle */}
        <g className="compass-needle">
          <path d="M28 17 L32.5 28 L28 39 L23.5 28 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M28 17 L32.5 28 L28 28 Z" fill="var(--color-flame)" stroke="var(--color-flame)" strokeWidth="0.8" />
          <path d="M28 39 L23.5 28 L28 28 Z" fill="currentColor" opacity={0.9} />
          <circle cx="28" cy="28" r="2.2" fill="var(--color-ink-deep)" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="28" cy="28" r="0.9" fill="var(--color-brass)" />
        </g>
        {/* orbit dot */}
        <circle className="compass-orbit" cx="28" cy="12.2" r="1.1" fill="var(--color-brass)" />
      </svg>
    </span>
  )
}

export function IconDiscovery({ animate = true }: { animate?: boolean }) {
  return (
    <span className={`pillar-icon pillar-icon--pin${animate ? ' is-animated' : ''}`} aria-hidden>
      <svg viewBox="0 0 56 56" width={56} height={56} fill="none">
        {/* map grid hint */}
        <g opacity={0.14} stroke="currentColor" strokeWidth="0.7">
          <path d="M8 20 H48" />
          <path d="M8 28 H48" />
          <path d="M8 36 H48" />
          <path d="M20 8 V48" />
          <path d="M28 8 V48" />
          <path d="M36 8 V48" />
        </g>
        {/* pulse rings */}
        <circle className="pin-pulse" cx="28" cy="23" r="10" stroke="var(--color-flame)" strokeWidth="0.9" fill="none" opacity={0.35} />
        <circle className="pin-pulse pin-pulse--2" cx="28" cy="23" r="15.5" stroke="var(--color-flame)" strokeWidth="0.7" fill="none" opacity={0.18} />
        {/* pin */}
        <g className="pin-body">
          <path d="M28 13.5 A9.5 9.5 0 0 0 18.5 23 A9.5 9.5 0 0 0 28 36.5 A9.5 9.5 0 0 0 37.5 23 A9.5 9.5 0 0 0 28 13.5 Z" fill="var(--color-ink-deep)" stroke="currentColor" strokeWidth="1.3" />
          <path d="M28 36.5 L26.2 42.5 L28 44 L29.8 42.5 Z" fill="var(--color-ink-deep)" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          {/* inner circle */}
          <circle cx="28" cy="23" r="5.2" fill="var(--color-flame)" stroke="white" strokeWidth="0.9" />
          {/* eye / camera glyph */}
          <g className="pin-eye" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none">
            <path d="M25.2 23 Q28 20.6 30.8 23 Q28 25.4 25.2 23 Z" />
            <circle cx="28" cy="23" r="1.35" fill="white" stroke="none" />
          </g>
          {/* highlight */}
          <path d="M21.5 18.5 Q23 16.5 25.5 15.8" stroke="white" strokeWidth="0.9" opacity={0.22} strokeLinecap="round" fill="none" />
        </g>
        {/* small pins */}
        <g opacity={0.95}>
          <circle cx="14.5" cy="38.5" r="2.3" fill="var(--color-brass)" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="41.5" cy="40" r="1.7" fill="var(--color-success)" stroke="white" strokeWidth={0.6} />
        </g>
      </svg>
    </span>
  )
}
