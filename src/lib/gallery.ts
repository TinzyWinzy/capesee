/** Auto-generated gallery manifest — all field captures in public/images + public/videos.
 *  Add alt overrides in ALT_OVERRIDES. New files in public/images|videos are picked up by re-running generation.
 */

export interface GalleryImage { src: string; webpSrc: string; alt: string; stem: string }
export interface GalleryVideo { src: string; alt: string; stem: string }

export function webpFor(src: string): string {
  return src.replace(/\.jpe?g$/i, '.webp')
}

const ALT_OVERRIDES: Record<string, string> = {
  'IMG-20260823-WA0114': "Hout Bay from Chapman's Peak, Cape Peninsula",
  'IMG-20260823-WA0119': 'Golden hour sunset over the Cape lagoon',
  'IMG-20260823-WA0141': 'Camps Bay beach with the Twelve Apostles',
  'IMG-20260823-WA0153': 'Chapmans Peak viewpoint over Hout Bay',
  'IMG-20260823-WA0160': 'Cape Peninsula coastal cliffs',
  'IMG-20260823-WA0180': 'Sunlight through Stellenbosch vineyard trees',
  'IMG-20260823-WA0150': 'Viewpoint over Hout Bay',
  'IMG-20260823-WA0179': 'Tokara Wine Estate sign',
  'IMG-20260823-WA0184': 'Wine estate courtyard',
  'IMG-20260823-WA0192': 'Cape farmhouse lawn',
  'IMG-20260823-WA0173': 'Suspension bridge at estate',
  'IMG-20260823-WA0185': 'Winery garden path',
  'IMG-20260823-WA0131': 'Cape Town heritage building',
  'IMG-20260823-WA0117': 'Dramatic storm clouds',
}

function altFor(stem: string): string {
  if (ALT_OVERRIDES[stem]) return ALT_OVERRIDES[stem]
  return stem.replace(/^IMG-|^VID-/, '').replace(/-/g, ' ') + ' — field capture'
}

const IMAGE_STEMS = [
  'IMG-20260823-WA0114','IMG-20260823-WA0117','IMG-20260823-WA0119','IMG-20260823-WA0120','IMG-20260823-WA0121','IMG-20260823-WA0122','IMG-20260823-WA0123','IMG-20260823-WA0124','IMG-20260823-WA0125','IMG-20260823-WA0126','IMG-20260823-WA0129','IMG-20260823-WA0130','IMG-20260823-WA0131','IMG-20260823-WA0132','IMG-20260823-WA0133','IMG-20260823-WA0135','IMG-20260823-WA0139','IMG-20260823-WA0140','IMG-20260823-WA0141','IMG-20260823-WA0142','IMG-20260823-WA0144','IMG-20260823-WA0145','IMG-20260823-WA0146','IMG-20260823-WA0147','IMG-20260823-WA0148','IMG-20260823-WA0149','IMG-20260823-WA0150','IMG-20260823-WA0151','IMG-20260823-WA0152','IMG-20260823-WA0153','IMG-20260823-WA0154','IMG-20260823-WA0155','IMG-20260823-WA0156','IMG-20260823-WA0157','IMG-20260823-WA0159','IMG-20260823-WA0160','IMG-20260823-WA0161','IMG-20260823-WA0162','IMG-20260823-WA0163','IMG-20260823-WA0165','IMG-20260823-WA0166','IMG-20260823-WA0167','IMG-20260823-WA0168','IMG-20260823-WA0169','IMG-20260823-WA0170','IMG-20260823-WA0171','IMG-20260823-WA0172','IMG-20260823-WA0173','IMG-20260823-WA0174','IMG-20260823-WA0175','IMG-20260823-WA0176','IMG-20260823-WA0178','IMG-20260823-WA0179','IMG-20260823-WA0180','IMG-20260823-WA0181','IMG-20260823-WA0182','IMG-20260823-WA0183','IMG-20260823-WA0184','IMG-20260823-WA0185','IMG-20260823-WA0186','IMG-20260823-WA0187','IMG-20260823-WA0188','IMG-20260823-WA0189','IMG-20260823-WA0192','IMG-20260901-WA0009','IMG-20260901-WA0010','IMG-20260901-WA0011','IMG-20260901-WA0012','IMG-20260901-WA0013','IMG-20260901-WA0014','IMG-20260901-WA0015','IMG-20260901-WA0016','IMG-20260901-WA0017','IMG-20260901-WA0018','IMG-20260901-WA0019','IMG-20260901-WA0020','IMG-20260901-WA0021','IMG-20260901-WA0022','IMG-20260901-WA0023','IMG-20260901-WA0024','IMG-20260901-WA0025','IMG-20260901-WA0026','IMG-20260901-WA0027','IMG-20260901-WA0028',
]

export const galleryImages: GalleryImage[] = IMAGE_STEMS.map(stem => ({
  src: `/images/${stem}.jpg`,
  webpSrc: `/images/${stem}.webp`,
  alt: altFor(stem),
  stem,
}))

export const galleryVideos: GalleryVideo[] = [
  { src: '/videos/VID-20260823-WA0041.mp4', alt: altFor('VID-20260823-WA0041'), stem: 'VID-20260823-WA0041' },
  { src: '/videos/VID-20260823-WA0065.mp4', alt: altFor('VID-20260823-WA0065'), stem: 'VID-20260823-WA0065' },
  { src: '/videos/VID-20260823-WA0137.mp4', alt: altFor('VID-20260823-WA0137'), stem: 'VID-20260823-WA0137' },
  { src: '/videos/VID-20260823-WA0158.mp4', alt: altFor('VID-20260823-WA0158'), stem: 'VID-20260823-WA0158' },
  { src: '/videos/VID-20260823-WA0164.mp4', alt: altFor('VID-20260823-WA0164'), stem: 'VID-20260823-WA0164' },
  { src: '/videos/VID-20260823-WA0177.mp4', alt: altFor('VID-20260823-WA0177'), stem: 'VID-20260823-WA0177' },
  { src: '/videos/VID-20260823-WA0284.mp4', alt: altFor('VID-20260823-WA0284'), stem: 'VID-20260823-WA0284' },
  { src: '/videos/VID-20260823-WA0285.mp4', alt: altFor('VID-20260823-WA0285'), stem: 'VID-20260823-WA0285' },
  { src: '/videos/VID-20260823-WA0320.mp4', alt: altFor('VID-20260823-WA0320'), stem: 'VID-20260823-WA0320' },
  { src: '/videos/VID-20260823-WA0330.mp4', alt: altFor('VID-20260823-WA0330'), stem: 'VID-20260823-WA0330' },
  { src: '/videos/VID-20260823-WA0334.mp4', alt: altFor('VID-20260823-WA0334'), stem: 'VID-20260823-WA0334' },
  { src: '/videos/VID-20260826-WA0057.mp4', alt: altFor('VID-20260826-WA0057'), stem: 'VID-20260826-WA0057' },
  { src: '/videos/VID-20260826-WA0059.mp4', alt: altFor('VID-20260826-WA0059'), stem: 'VID-20260826-WA0059' },
  { src: '/videos/VID-20260901-WA0029.mp4', alt: altFor('VID-20260901-WA0029'), stem: 'VID-20260901-WA0029' },
  { src: '/videos/VID-20260901-WA0030.mp4', alt: altFor('VID-20260901-WA0030'), stem: 'VID-20260901-WA0030' },
]

export const galleryCount = { images: galleryImages.length, videos: galleryVideos.length, total: galleryImages.length + galleryVideos.length }
