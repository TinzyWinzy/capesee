import { webpFor } from '@/lib/gallery'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

/** Serves WebP when available, falls back to original JPG. */
export function ResponsiveImage({ src, alt, loading = 'lazy', decoding = 'async', ...rest }: Props) {
  const webp = webpFor(src)
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />
    </picture>
  )
}
