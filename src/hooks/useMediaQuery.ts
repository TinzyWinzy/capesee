import { useEffect, useState } from 'react'

/** True when viewport matches the given media query. Default: desktop (>= 768px). */
export function useMediaQuery(query = '(min-width: 768px)'): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
