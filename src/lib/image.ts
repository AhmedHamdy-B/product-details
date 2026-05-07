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
  // Force deterministic optimization params while preserving upstream overrides when present.
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
    // Only rewrite known Unsplash URLs; keep third-party/CDN links untouched.
    if (!isUnsplashUrl(parsed)) {
      return { src: rawUrl, sizes: options.sizes }
    }

    const quality = options.quality ?? 80
    // Ensure srcSet ordering is predictable and largest width becomes default src.
    const widths = [...options.widths].sort((a, b) => a - b)
    const largest = widths[widths.length - 1]

    const src = withUnsplashDefaults(parsed, largest, quality).toString()
    const srcSet = widths
      .map((width) => `${withUnsplashDefaults(parsed, width, quality).toString()} ${width}w`)
      .join(', ')

    return { src, srcSet, sizes: options.sizes }
  } catch {
    // Invalid URL input should degrade gracefully to the raw source.
    return { src: rawUrl, sizes: options.sizes }
  }
}
