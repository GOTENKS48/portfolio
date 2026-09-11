'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Prevent ScrollTrigger from attempting conflicting automatic restoration
    ScrollTrigger.clearScrollMemory('manual')

    const savedY = parseInt(sessionStorage.getItem('portfolio_scroll_y') || '0', 10)

    // 1. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple/Google-like exponential ease
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    ;(window as any).__lenis = lenis

    // 2. Register ScrollTrigger update with Lenis scroll event
    lenis.on('scroll', ScrollTrigger.update)

    // 3. Connect GSAP ticker to update Lenis on every frame
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateRaf)

    // 4. Disable lag smoothing for GSAP to avoid sync offsets
    gsap.ticker.lagSmoothing(0)

    // 5. Restore scroll instantly without animating from 0
    if (savedY > 0) {
      window.scrollTo(0, savedY)
      lenis.scrollTo(savedY, { immediate: true })
      ScrollTrigger.refresh()
    }

    // 6. Keep sessionStorage updated with current scroll position
    const saveScroll = () => {
      const y = Math.round(window.scrollY)
      sessionStorage.setItem('portfolio_scroll_y', String(y < 30 ? 0 : y))
    }

    window.addEventListener('scroll', saveScroll, { passive: true })
    window.addEventListener('beforeunload', saveScroll)

    // 7. Clean up on unmount
    return () => {
      window.removeEventListener('scroll', saveScroll)
      window.removeEventListener('beforeunload', saveScroll)
      lenis.destroy()
      ;(window as any).__lenis = null
      gsap.ticker.remove(updateRaf)
    }
  }, [])

  return null
}
