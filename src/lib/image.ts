type ResponsiveImageOptions = {
  widths: readonly number[]
  sizes: string
  quality?: number
}

type ResponsiveImageAttrs = {
  src: string
  srcSet?: string
  sizes?: string
}

function isUnsplashUrl(url: URL): boolean {
  return url.hostname.includes('images.unsplash.com')
}

function withUnsplashDefaults(url: URL, width: number, quality: number): URL {
  const copy = new URL(url.toString())
  copy.searchParams.set('auto', 'format')
  copy.searchParams.set('fit', copy.searchParams.get('fit') ?? 'crop')
  copy.searchParams.set('q', copy.searchParams.get('q') ?? String(quality))
  copy.searchParams.set('w', String(width))
  return copy
}

export function getResponsiveImageAttrs(
  rawUrl: string,
  options: ResponsiveImageOptions,
): ResponsiveImageAttrs {
  try {
    const parsed = new URL(rawUrl)
    if (!isUnsplashUrl(parsed)) {
      return { src: rawUrl, sizes: options.sizes }
    }

    const quality = options.quality ?? 80
    const widths = [...options.widths].sort((a, b) => a - b)
    const largest = widths[widths.length - 1]

    const src = withUnsplashDefaults(parsed, largest, quality).toString()
    const srcSet = widths
      .map((width) => `${withUnsplashDefaults(parsed, width, quality).toString()} ${width}w`)
      .join(', ')

    return { src, srcSet, sizes: options.sizes }
  } catch {
    return { src: rawUrl, sizes: options.sizes }
  }
}
