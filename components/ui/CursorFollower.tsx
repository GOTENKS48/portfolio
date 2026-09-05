'use client'

import { useRef, useState, useCallback, useEffect, useId } from 'react'

export function useCursorFollower() {
  return {
    containerRef: { current: null },
    followerRef: { current: null },
    isVisible: false,
    handlers: {},
  }
}

interface CursorFollowerElementProps {
  label?: string
}

export function CursorFollowerElement({
  label = 'View',
}: CursorFollowerElementProps) {
  const followerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Target and current positions for smooth speed delay
  const targetPos = useRef({ x: -200, y: -200 })
  const currentPos = useRef({ x: -200, y: -200 })
  const animFrameId = useRef<number | null>(null)
  const isHovered = useRef(false)
  const hasMoved = useRef(false)

  const rawId = useId()
  const maskId = `mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  const updatePosition = useCallback(() => {
    if (!followerRef.current) return

    // Damping factor for smooth trailing speed delay (0.12 = smooth inertia)
    const factor = 0.12
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * factor
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * factor

    followerRef.current.style.left = `${currentPos.current.x}px`
    followerRef.current.style.top = `${currentPos.current.y}px`

    const dx = Math.abs(targetPos.current.x - currentPos.current.x)
    const dy = Math.abs(targetPos.current.y - currentPos.current.y)

    if (isHovered.current || dx > 0.1 || dy > 0.1) {
      animFrameId.current = requestAnimationFrame(updatePosition)
    } else {
      animFrameId.current = null
    }
  }, [])

  // Checks whether the element under the stationary cursor is a project card
  const checkHover = useCallback(() => {
    if (!hasMoved.current) return
    const el = document.elementFromPoint(targetPos.current.x, targetPos.current.y)
    const card = el?.closest('.project-card-link')
    const shouldBeVisible = !!card

    if (shouldBeVisible !== isHovered.current) {
      isHovered.current = shouldBeVisible
      setIsVisible(shouldBeVisible)
      if (shouldBeVisible && !animFrameId.current) {
        animFrameId.current = requestAnimationFrame(updatePosition)
      }
    }
  }, [updatePosition])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY }

      if (!hasMoved.current) {
        hasMoved.current = true
        currentPos.current = { x: e.clientX, y: e.clientY }
        if (followerRef.current) {
          followerRef.current.style.left = `${e.clientX}px`
          followerRef.current.style.top = `${e.clientY}px`
        }
      }

      checkHover()

      if (!animFrameId.current) {
        animFrameId.current = requestAnimationFrame(updatePosition)
      }
    }

    // When scrolling, mouse coordinates stay the same in viewport:
    // Check if a project card scrolled away or scrolled into position under cursor
    const handleScroll = () => {
      checkHover()
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    let lenisTimer: NodeJS.Timeout
    const bindLenis = () => {
      const lenis = (window as any).__lenis
      if (lenis) {
        lenis.on('scroll', handleScroll)
      } else {
        lenisTimer = setTimeout(bindLenis, 200)
      }
    }
    bindLenis()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(lenisTimer)
      const lenis = (window as any).__lenis
      if (lenis) {
        lenis.off('scroll', handleScroll)
      }
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current)
      }
    }
  }, [checkHover, updatePosition])

  return (
    <div
      ref={followerRef}
      className="cursor-follower select-none pointer-events-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate(-6px, -6px) scale(1)'
          : 'translate(-6px, -6px) scale(0.6)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <mask id={maskId}>
            {/* Solid white circle preserves follower area */}
            <circle cx="50" cy="50" r="49" fill="white" />
            {/* Black text cuts out the letters, making 'view' interior transparent */}
            <text
              x="50"
              y="50"
              dominantBaseline="central"
              textAnchor="middle"
              fill="black"
              fontSize="16"
              fontWeight="800"
              letterSpacing="0.08em"
              fontFamily="var(--font-sans), 'Inter', system-ui, sans-serif"
            >
              {label}
            </text>
          </mask>
        </defs>

        {/* Inverted body of the cursor follower (mix-blend-mode: difference) */}
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="white"
          mask={`url(#${maskId})`}
          style={{ mixBlendMode: 'difference' }}
        />

        {/* 'view' text: transparent fill with black boundaries */}
        <text
          x="50"
          y="50"
          dominantBaseline="central"
          textAnchor="middle"
          fill="transparent"
          stroke="#000000"
          strokeWidth="1.3"
          strokeLinejoin="round"
          fontSize="16"
          fontWeight="800"
          letterSpacing="0.08em"
          fontFamily="var(--font-sans), 'Inter', system-ui, sans-serif"
        >
          {label}
        </text>
      </svg>
    </div>
  )
}
