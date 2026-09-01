'use client'

import { useEffect, useState } from 'react'

export default function AvailableBadge() {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(now).toUpperCase()
    const year = new Intl.DateTimeFormat('en-US', { year: '2-digit' }).format(now)
    setLabel(`${month}'${year}`)
  }, [])

  return (
    <p
      className="font-black leading-none"
      style={{
        fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
        color: '#1a1a1a',
        letterSpacing: '-0.04em',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {label || "JUN'26"}
    </p>
  )
}
