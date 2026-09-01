'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onReveal70: () => void
  onComplete: () => void
}

export default function Preloader({ onReveal70, onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true)
  const [height, setHeight] = useState(1000)

  useEffect(() => {
    setHeight(window.innerHeight + 300)

    // Curtain sweep: duration 3.5s, ease [0.16,1,0.3,1].
    // This ease is heavily front-loaded — the curtain rushes up in the first ~600ms,
    // then dramatically decelerates, spending 2.9s slowly creeping off the top.
    // We fire the reveal at 600ms: the curtain has blasted past the headline area,
    // but the hero letters (clipped at y:110%) are still invisible. The slow final
    // stretch of the curtain plays out in the background as letters rise into view.
    const revealTimer = setTimeout(() => {
      onReveal70()
    }, 600)

    const completeTimer = setTimeout(() => {
      setIsMounted(false)
      onComplete()
    }, 3700)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(completeTimer)
    }
  }, [onReveal70, onComplete])

  // SVG viewBox 0 0 100 100 (preserveAspectRatio="none" stretches to fill)
  // Initial: curtain fills screen with a 27% deep bottom curve (matching reference)
  const initialPath = 'M0 0 L100 0 L100 100 Q50 73 0 100 Z'
  // Target: curve fully flattened to the top edge
  const targetPath = 'M0 0 L100 0 L100 0 Q50 0 0 0 Z'

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          className="fixed left-0 top-0 w-full z-50 pointer-events-none"
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
