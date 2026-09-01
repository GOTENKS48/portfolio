'use client'

import { useRef, useState, useCallback } from 'react'

export function useCursorFollower() {
  const containerRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !followerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    followerRef.current.style.left = `${x}px`
    followerRef.current.style.top = `${y}px`
  }, [])

  const handleMouseEnter = useCallback(() => setIsVisible(true), [])
  const handleMouseLeave = useCallback(() => setIsVisible(false), [])

  return {
    containerRef,
    followerRef,
    isVisible,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  }
}

interface CursorFollowerElementProps {
  followerRef: React.RefObject<HTMLDivElement>
  isVisible: boolean
  label?: string
}

export function CursorFollowerElement({
  followerRef,
  isVisible,
  label = 'View →',
}: CursorFollowerElementProps) {
  return (
    <div
      ref={followerRef}
      className="cursor-follower select-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate(-50%, -50%) scale(1)'
          : 'translate(-50%, -50%) scale(0.6)',
      }}
    >
      <span className="text-[11px] font-bold tracking-widest uppercase">{label}</span>
    </div>
  )
}
