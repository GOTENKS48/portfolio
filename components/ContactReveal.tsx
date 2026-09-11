'use client'

import { useRef, useEffect, ReactNode, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ContactRevealProps {
  children: ReactNode
}

/**
 * ContactReveal:
 * - Initially overlaps SkillsSection over ContactSection down to the "LET'S MAKE" heading,
 *   so "LET'S MAKE" is tucked under the Skills card and "IT HAPPEN" emerges below the curve.
 * - Smoothly unreveals ContactSection as the user scrolls down.
 * - When SkillsSection scrolls out of the viewport, the unreveal is complete and
 *   leaves a tasteful small gap between Skills and Contact.
 */
export default function ContactReveal({ children }: ContactRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState(() => {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth
      const isDesktop = vw >= 1024
      const isTablet = vw >= 768 && vw < 1024
      return {
        overlap: isDesktop ? 335 : isTablet ? 280 : 230,
        gap: isDesktop ? 36 : isTablet ? 32 : 28,
      }
    }
    return { overlap: 335, gap: 36 }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    const motionEl = motionRef.current
    if (!container || !motionEl) return

    const updateMetrics = () => {
      const h2 = container.querySelector('h2')
      let measuredOverlap = 0
      const vw = window.innerWidth

      if (h2) {
        // Distance from top of motionEl to the line dividing "LET'S MAKE" and "IT HAPPEN"
        const motionRect = motionEl.getBoundingClientRect()
        const h2Rect = h2.getBoundingClientRect()
        // Line 1 ("LET'S MAKE") bottom divider + radius compensation + extra tuck
        const lineDivider = h2Rect.top + h2Rect.height * 0.52 + 135
        measuredOverlap = Math.round(Math.max(200, lineDivider - motionRect.top))
      } else {
        measuredOverlap = Math.round(Math.min(Math.max(240, vw * 0.25), 420))
      }

      const measuredGap = Math.round(Math.min(Math.max(28, vw * 0.025), 40))
      setMetrics((prev) => {
        if (Math.abs(prev.overlap - measuredOverlap) > 4 || Math.abs(prev.gap - measuredGap) > 2) {
          return { overlap: measuredOverlap, gap: measuredGap }
        }
        return prev
      })
      return { overlap: measuredOverlap, gap: measuredGap }
    }

    const { overlap, gap } = updateMetrics()

    // Timeline: scrubs motionEl downwards as user scrolls through the overlap zone
    // Starts when Contact enters viewport bottom, ends exactly when Skills section exits top of viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: () => {
          const m = updateMetrics()
          return '+=' + (window.innerHeight + m.overlap)
        },
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    tl.to(
      motionEl,
      {
        y: () => {
          const m = updateMetrics()
          return m.overlap + m.gap
        },
        ease: 'power1.out',
      }
    )

    const onResize = () => {
      updateMetrics()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        zIndex: 10,
        // Negative top margin pulls Contact underneath Skills by exact overlap
        marginTop: `-${metrics.overlap}px`,
        // Bottom padding absorbs translateY so the document height and footer scroll cleanly
        paddingBottom: `${metrics.overlap + metrics.gap}px`,
        background: '#e8e8e3',
      }}
    >
      <div
        ref={motionRef}
        className="w-full"
        style={{ willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  )
}
