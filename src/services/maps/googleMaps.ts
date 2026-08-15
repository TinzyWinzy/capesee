/**
 * Google Maps loader. Lazy-injects the Maps JavaScript API once when a key is
 * set (VITE_GOOGLE_MAPS_API_KEY). MapSurface upgrades from the mock grid to
 * real tiles whenever the key is present; without it, the mock stays.
 */
const KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() || ''

let pending: Promise<typeof google.maps> | null = null

export function hasGoogleMapsKey(): boolean {
  return Boolean(KEY)
}

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (!KEY) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'))
  if (!pending) pending = init()
  return pending
}

async function init(): Promise<typeof google.maps> {
  await whenScriptReady()
  return waitForMaps()
}

/**
 * The bootstrap script's `load` event fires before the API classes exist. Both
 * `window.google.maps.importLibrary` and `window.google.maps.Map` mount at the
 * same later tick (confirmed empirically ~1.5s after load), so poll for `Map`
 * instead of trusting the load event.
 */
async function waitForMaps(): Promise<typeof google.maps> {
  const deadline = Date.now() + 20000
  for (;;) {
    const gmaps = window.google?.maps
    if (typeof gmaps?.Map === 'function') return gmaps
    if (Date.now() > deadline) throw new Error('Google Maps API timed out')
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

/** Injects the bootstrap script and resolves once it has loaded (async-safe). */
function whenScriptReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-capesee-gmaps]')
    if (existing && existing.dataset.loaded === '1') {
      resolve()
      return
    }

    const script = existing ?? document.createElement('script')
    if (!existing) {
      script.dataset.capeseeGmaps = '1'
      script.async = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&loading=async&v=weekly`
      document.head.appendChild(script)
    }

    const onLoad = () => {
      script.dataset.loaded = '1'
      resolve()
    }
    const onError = () => reject(new Error('Google Maps script failed to load'))
    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
  })
}
