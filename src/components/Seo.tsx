import { useEffect } from 'react'

export interface SeoProps {
  title?: string
  description?: string
  canonical?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  keywords?: string[]
}

const SITE_URL = 'https://www.capesee.com'
const SITE_NAME = 'Capesee'
const DEFAULT_TITLE = 'Capesee — Rent vans for groups 3–8'
const DEFAULT_DESCRIPTION =
  'Rent vans for groups 3–8 in the Cape: standard to mini, self-drive or with driver, plus private tours — pay on arrival.'
const DEFAULT_IMAGE = 'https://www.capesee.com/images/IMG-20260823-WA0114.jpg'

function upsertMeta(selector: string, create: () => HTMLMetaElement) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

function setMetaName(name: string, content: string) {
  const el = upsertMeta(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('name', name)
    return m
  })
  el.setAttribute('content', content)
}

function setMetaProperty(property: string, content: string) {
  const el = upsertMeta(`meta[property="${property}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', property)
    return m
  })
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  const el = upsertMeta(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link')
    l.setAttribute('rel', rel)
    return l as unknown as HTMLMetaElement
  }) as unknown as HTMLLinkElement
  el.setAttribute('href', href)
}

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  imageAlt = 'Capesee — Cape Peninsula field capture',
  type = 'website',
  noindex = false,
  jsonLd,
  keywords,
}: SeoProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
  const url = canonical ? `${SITE_URL}${canonical}` : undefined
  const absImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  useEffect(() => {
    document.title = fullTitle

    // Standard
    setMetaName('description', description)
    if (keywords?.length) setMetaName('keywords', keywords.join(', '))
    setMetaName('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')

    // Canonical
    if (url) setLink('canonical', url)

    // Open Graph
    setMetaProperty('og:site_name', SITE_NAME)
    setMetaProperty('og:title', fullTitle)
    setMetaProperty('og:description', description)
    setMetaProperty('og:type', type)
    setMetaProperty('og:image', absImage)
    setMetaProperty('og:image:alt', imageAlt)
    if (url) setMetaProperty('og:url', url)

    // Twitter
    setMetaName('twitter:card', 'summary_large_image')
    setMetaName('twitter:title', fullTitle)
    setMetaName('twitter:description', description)
    setMetaName('twitter:image', absImage)

    // JSON-LD
    const existing = document.head.querySelector('script[data-seo-jsonld]')
    if (existing) existing.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', 'true')
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
      document.head.appendChild(script)
    }

    // Cleanup not needed — next Seo mount overwrites
  }, [fullTitle, description, url, absImage, imageAlt, type, noindex, jsonLd, keywords])

  return null
}

export const seoDefaults = {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
}
