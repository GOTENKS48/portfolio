'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import NavOverlay from './NavOverlay'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const topFadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.55,
      duration: 1.35,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
}

interface NavbarProps {
  isScrolled?: boolean
  showHamburger?: boolean
  triggerReveal?: boolean
  servicesY?: MotionValue<number>
}

export default function Navbar({ isScrolled = false, showHamburger = false, triggerReveal = false, servicesY }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const { scrollY } = useScroll()
  const defaultScrollY = scrollY
  const fallbackServicesY = useTransform(defaultScrollY, [0, 120], [40, 0])
  const activeServicesY = servicesY || fallbackServicesY

  // ── Asymmetric scroll-trigger timing ───────────────────────────────────────
  // 1. Downward: disappear instantly (as soon as activeServicesY drops below 39.9).
  // 2. Upward: reappear slightly earlier (when activeServicesY reaches 35.0),
  //    letting the spring slide it back down naturally with its own timing.
  // ───────────────────────────────────────────────────────────────────────────
  const lastLatestRef = useRef(40)
  const dirRef = useRef<'up' | 'down'>('up')

  const targetHeaderY = useTransform(activeServicesY, (latest: number): number => {
    const prev = lastLatestRef.current
    lastLatestRef.current = latest

    if (latest < prev - 0.01) {
      dirRef.current = 'down'
    } else if (latest > prev + 0.01) {
      dirRef.current = 'up'
    }

    const direction = dirRef.current

    if (direction === 'down') {
      return latest < 39.9 ? -120 : 0
    } else {
      return latest >= 35.0 ? 0 : -120
    }
  })

  const headerY = useSpring(targetHeaderY, { stiffness: 220, damping: 26, mass: 0.8 })

  // ── Scroll-driven glass panel background & blur ────────────────────────────
  // We interpolate the background opacity and backdrop filter blur smoothly
  // based on the scroll position, so the glass panel dissolves seamlessly
  // into the hero background as it settles at the top (scrollY = 0).
  // ───────────────────────────────────────────────────────────────────────────
  const headerBg = useTransform(
    scrollY,
    [0, 40],
    ['rgba(232, 232, 227, 0)', 'rgba(232, 232, 227, 0.92)']
  )

  const headerBlur = useTransform(
    scrollY,
    [0, 40],
    ['blur(0px)', 'blur(12px)']
  )

  // Hamburger menu: appears after scrolling past 1vh
  const menuOpacity = useTransform(scrollY, (latest) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720
    if (latest < vh) return 0
    return Math.min(1, (latest - vh) / 50)
  })

  const menuScale = useTransform(scrollY, (latest) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720
    if (latest < vh) return 0
    return Math.min(1, (latest - vh) / 50)
  })

  const menuPointerEvents = useTransform(scrollY, (latest) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720
    return latest >= vh ? 'auto' : 'none'
  })

  const menuDisplay = useTransform(scrollY, (latest) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720
    return latest >= vh ? 'flex' : 'none'
  })

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 z-40 flex items-center"
        style={{
          top: 'clamp(1.25rem, 1.2rem + 0.3vi, 1.75rem)',
          height: 'clamp(52px, 4.5vh, 60px)',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
          background: menuOpen ? 'transparent' : headerBg,
          backdropFilter: menuOpen ? 'none' : headerBlur,
          WebkitBackdropFilter: menuOpen ? 'none' : headerBlur,
          y: headerY,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="w-full flex items-center justify-between">
          {/* Left: role descriptor */}
          <motion.span
            variants={topFadeVariants}
            initial="hidden"
            animate={triggerReveal ? 'visible' : 'hidden'}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 'clamp(0.8rem, min(1.15vw, 2.4vh), 1rem)',
              fontWeight: 500,
              color: '#6B645C',
              letterSpacing: '-0.02em',
              cursor: 'default',
              display: 'inline-block',
            }}
          >
            Software Developer &amp; Problem Solver
          </motion.span>

          {/* Right: navigation links + hamburger toggle */}
          <motion.div
            className="flex items-center"
            variants={topFadeVariants}
            initial="hidden"
            animate={triggerReveal ? 'visible' : 'hidden'}
            style={{
              gap: 'clamp(12px, min(1.2vw, 2.5vh), 18px)',
            }}
          >
            {/* Desktop links */}
            <nav className="hidden md:flex items-center" style={{ gap: 'clamp(12px, min(1.2vw, 2.5vh), 18px)' }}>
              {navLinks.map((link) => {
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="group relative py-1 focus:outline-none"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 'clamp(0.8rem, min(1.15vw, 2.4vh), 1rem)',
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      color: '#6B645C',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-[350ms] ease-[cubic-bezier(0.25, 1, 0.5, 1)] group-hover:-translate-y-full">
                        {link.label}
                      </span>
                      <span className="absolute top-0 left-0 block transition-transform duration-[350ms] ease-[cubic-bezier(0.25, 1, 0.5, 1)] translate-y-full group-hover:translate-y-0">
                        {link.label}
                      </span>
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* Hamburger circular menu toggle (scroll-driven reveal) */}
            <motion.button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-[clamp(4px, 0.4vw, 5px)]"
              style={{
                borderColor: 'rgba(107,100,92,0.3)',
                background: 'rgba(107,100,92,0.06)',
                transition: 'background 250ms ease, transform 250ms ease',
                opacity: menuOpacity,
                scale: menuScale,
                pointerEvents: menuPointerEvents,
                display: menuDisplay,
              }}
              aria-label="Open menu"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(107,100,92,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(107,100,92,0.06)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <span className="block" style={{ width: 'clamp(13px, 1.1vw, 16px)', height: 'clamp(1.2px, 0.1vw, 1.5px)', background: '#6B645C' }} />
              <span className="block" style={{ width: 'clamp(13px, 1.1vw, 16px)', height: 'clamp(1.2px, 0.1vw, 1.5px)', background: '#6B645C' }} />
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
