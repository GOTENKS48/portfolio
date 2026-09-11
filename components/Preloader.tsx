'use client'

import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onReveal70: () => void
  onComplete: () => void
}

export default function Preloader({ onReveal70, onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true)
  const [height, setHeight] = useState(4000)

  // Store callbacks in refs so the animation effect never re-runs due to
  // new inline arrow references created by parent re-renders (e.g. from scroll).
  const onReveal70Ref = useRef(onReveal70)
  const onCompleteRef = useRef(onComplete)
  onReveal70Ref.current = onReveal70
  onCompleteRef.current = onComplete

  // This effect runs exactly once on mount — empty dependency array.
  // Callbacks are accessed via refs, so scroll-triggered re-renders in the
  // parent cannot restart the effect or skip the animation.
  // Set correct height BEFORE the browser paints the first frame,
  // so the curtain covers the full viewport on every resolution.
  useLayoutEffect(() => {
    setHeight(window.innerHeight + 375)
  }, [])

  useEffect(() => {
    // Bypass preloader entirely on page reload / scroll restoration
    if (
      typeof window !== 'undefined' &&
      (document.documentElement.classList.contains('is-restoring-scroll') ||
        parseInt(sessionStorage.getItem('portfolio_scroll_y') || '0', 10) > 50)
    ) {
      onReveal70Ref.current()
      onCompleteRef.current()
      setIsMounted(false)
      return
    }

    // Curtain sweep: duration 3.5s, ease [0.16,1,0.3,1].
    // This ease is heavily front-loaded — the curtain rushes up in the first ~600ms,
    // then dramatically decelerates, spending 2.9s slowly creeping off the top.
    // We fire the reveal at 600ms: the curtain has blasted past the headline area,
    // but the hero letters (clipped at y:110%) are still invisible. The slow final
    // stretch of the curtain plays out in the background as letters rise into view.
    const revealTimer = setTimeout(() => {
      onReveal70Ref.current()
    }, 600)

    const completeTimer = setTimeout(() => {
      setIsMounted(false)
      onCompleteRef.current()
    }, 3700)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(completeTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // SVG viewBox 0 0 100 100 (preserveAspectRatio="none" stretches to fill)
  // Initial: curtain fills screen with a 27% deep bottom curve (matching reference)
  const initialPath = 'M0 0 L100 0 L100 100 Q50 73 0 100 Z'
  // Target: curve fully flattened to the top edge
  const targetPath = 'M0 0 L100 0 L100 0 Q50 0 0 0 Z'

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          className="preloader-curtain fixed left-0 top-0 w-full z-50 pointer-events-none"
          style={{
            height: height,
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
          }}
          initial={{ y: 0 }}
          animate={{ y: -height }}
          transition={{
            // Dramatically slow: 3.5s total. Front-loaded ease gives instant rush
            // then an ultra-slow, weighty crawl to the ceiling.
            duration: 3.5,
            ease: [0.16, 1, 0.3, 1] as const,
            delay: 0,
          }}
        >
          <svg
            className="w-full h-full absolute top-0 left-0 fill-[#1A1A1A] pointer-events-none"
            style={{
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.path
              style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
              }}
              initial={{ d: initialPath }}
              animate={{ d: targetPath }}
              transition={{
                // Curve flattens over 7s — trails slowly behind the div,
                // giving the illusion the curve is being stretched taut
                duration: 7,
                ease: 'easeOut',
                delay: 0,
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
