'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll() {
  useEffect(() => {
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

    // 2. Register ScrollTrigger update with Lenis scroll event
    lenis.on('scroll', ScrollTrigger.update)

    // 3. Connect GSAP ticker to update Lenis on every frame
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateRaf)

    // 4. Disable lag smoothing for GSAP to avoid sync offsets
    gsap.ticker.lagSmoothing(0)

    // 5. Clean up on unmount
    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateRaf)
    }
  }, [])

  return null
}
