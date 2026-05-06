import { Star } from 'lucide-react'
import type { CSSProperties } from 'react'

/** Same hue as PDP header star — use everywhere for filled stars & rating ring */
export const STORE_STAR_HEX = '#FFA439' as const

type StarsProps = {
  value: number
  count?: number
  className?: string
  /** Tighter gap for dense review rows; fill color is always `STORE_STAR_HEX`. */
  variant?: 'default' | 'review'
  /** Pixel size for each star glyph */
  starSizePx?: number
}

/** Compact star row using half-step fidelity for storefront ratings */
export function Stars({
  value,
  count = 5,
  className = '',
  variant = 'default',
  starSizePx = 18,
}: StarsProps) {
  const stars = []
  const clamped = Math.min(Math.max(value, 0), count)

  const emptyClass = 'text-neutral-300'
  const slotClass = `${className ?? ''}`
  const fillColor: CSSProperties = { color: STORE_STAR_HEX }

  for (let index = 1; index <= count; index += 1) {
    const remainder = clamped + 1 - index
    const fillLevel = remainder >= 1 ? 1 : remainder > 0 ? remainder : 0

    stars.push(
      <span
        key={`star-slot-${index}`}
        className={`relative inline-block shrink-0 ${slotClass}`}
        style={{ width: starSizePx, height: starSizePx }}
      >
        <Star
          size={starSizePx}
          className={emptyClass}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={0.35}
          aria-hidden
        />
        {fillLevel > 0 ? (
          <span
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ width: `${fillLevel * 100}%`, ...fillColor }}
          >
            <Star
              size={starSizePx}
              style={{ minWidth: starSizePx, ...fillColor }}
              className="shrink-0"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0.35}
              aria-hidden
            />
          </span>
        ) : null}
      </span>,
    )
  }

  const gapPx = variant === 'review' ? 4 : 3

  return (
    <span
      className="inline-flex shrink-0 items-center"
      style={{ gap: gapPx }}
    >
      {stars}
    </span>
  )
}
