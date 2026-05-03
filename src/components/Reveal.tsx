import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react'

import { cn } from '../lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger: passed as `animation-delay` when the fade runs (ms) */
  delayMs?: number
}

/**
 * Fade-in on scroll / mount — same idea as
 * [Tailwind fade-in on scroll (React + Vite)](https://www.youtube.com/watch?v=xG4lp3KGqoI):
 * `opacity: 0` until the block intersects the viewport, then `animate-scroll-fade` (2s ease-out both).
 */
export function Reveal({ children, className, delayMs = 0 }: RevealProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    if (mq.matches) setVisible(true)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const el = ref.current
    if (!el) return

    let done = false
    const mark = () => {
      if (done) return
      done = true
      setVisible(true)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            mark()
            io.disconnect()
            return
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px 18% 0px' },
    )

    io.observe(el)

    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const node = ref.current
        if (!node || done) return
        const r = node.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        if (r.top < vh * 0.92 && r.bottom > -vh * 0.05) {
          mark()
          io.disconnect()
        }
      })
    })

    const timeoutId = window.setTimeout(() => {
      const node = ref.current
      if (!node || done) return
      const r = node.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      if (r.top < vh && r.bottom > 0) {
        mark()
        io.disconnect()
      }
    }, 120)

    return () => {
      done = true
      io.disconnect()
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.clearTimeout(timeoutId)
    }
  }, [reduceMotion])

  return (
    <div
      ref={ref}
      className={cn(
        reduceMotion ? 'opacity-100' : visible ? 'animate-scroll-fade' : 'opacity-0',
        className,
      )}
      style={
        visible && delayMs > 0 && !reduceMotion ? { animationDelay: `${delayMs}ms` } : undefined
      }
    >
      {children}
    </div>
  )
}
