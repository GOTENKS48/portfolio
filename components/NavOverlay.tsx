'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { socials } from '@/lib/data'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'HOME', href: '#home' },
  { label: 'SERVICES', href: '#services' },
  { label: 'WORKS', href: '#works' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: socials.linkedin },
  { label: 'Github', href: socials.github },
  { label: 'Leetcode', href: socials.leetcode },
]

export default function NavOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  // ─── 1. Scroll-Triggered Button Visibility ──────────────────────────────────
  useEffect(() => {
    const checkVisibility = () => {
      const target = document.querySelector(
        '#what-i-do, .what-i-do-section, #services, [data-services-panel]'
      )

      if (!target) return

      const rect = target.getBoundingClientRect()
      if (rect.top <= 80) {
        setIsButtonVisible(true)
      } else {
        setIsButtonVisible(false)
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })

    const target = document.querySelector(
      '#what-i-do, .what-i-do-section, #services, [data-services-panel]'
    )
    let observer: IntersectionObserver | null = null
    if (target) {
      observer = new IntersectionObserver(
        () => {
          checkVisibility()
        },
        { threshold: [0, 0.05, 0.1, 0.5, 1], rootMargin: '0px' }
      )
      observer.observe(target)
    }

    checkVisibility()

    return () => {
      window.removeEventListener('scroll', checkVisibility)
      if (observer) observer.disconnect()
    }
  }, [])

  // ─── 2. Escape Key Handler ──────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // ─── 3. Lock Background Scroll When Overlay Is Open ────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = (window as any).__lenis
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (lenis) lenis.start()
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      const l = (window as any).__lenis
      if (l) l.start()
    }
  }, [isOpen])

  // ─── 4. Navigation Link Click & Smooth Scroll ───────────────────────────────
  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    const lenis = (window as any).__lenis
    if (lenis) {
      lenis.start()
      setTimeout(() => {
        lenis.scrollTo(href, { duration: 1.2 })
      }, 450)
    } else {
      setTimeout(() => {
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }, 450)
    }
  }

  // Determine if the toggle button should be rendered in visible scale state
  const showButton = isButtonVisible || isOpen

  return (
    <>
      {/* ─── Floating Circular Toggle Button (Cream Circle & Dark Ink Lines) ─── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="navigation-drawer"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="fixed top-8 right-8 z-[110] flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A867A] cursor-pointer"
        style={{
          width: '50px',
          height: '50px',
          top: '2rem',
          right: '2rem',
          backgroundColor: '#e8e8e3',
          color: '#141414',
          transform: showButton ? 'scale(1)' : 'scale(0)',
          opacity: showButton ? 1 : 0,
          pointerEvents: showButton ? 'auto' : 'none',
          transition:
            'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, background-color 0.2s ease',
        }}
      >
        {/* Animated 2-Line Morph into 'X' */}
        <div className="relative w-7 h-7 flex items-center justify-center pointer-events-none">
          {/* Top line */}
          <span
            className="absolute block h-[1.5px] w-[24px] bg-[#141414] rounded-full"
            style={{
              transform: isOpen
                ? 'translateY(0px) rotate(45deg)'
                : 'translateY(-3.5px) rotate(0deg)',
              transition:
                'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease',
            }}
          />
          {/* Bottom line */}
          <span
            className="absolute block h-[1.5px] w-[24px] bg-[#141414] rounded-full"
            style={{
              transform: isOpen
                ? 'translateY(0px) rotate(-45deg)'
                : 'translateY(3.5px) rotate(0deg)',
              transition:
                'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease',
            }}
          />
        </div>
      </button>

      {/* ─── Fixed Full-Screen Container (Dark Frosted Ink Glass) ────────────── */}
      <div
        id="navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        data-lenis-prevent="true"
        className="fixed inset-0 w-screen h-screen overflow-hidden z-[100]"
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="frosted-panel"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{
                x: '100%',
                transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
              }}
              transition={{
                duration: 0.88,
                ease: [0.05, 0.7, 0.1, 1] as const,
              }}
              className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                transform: 'translate3d(0, 0, 0)',
                WebkitBackfaceVisibility: 'hidden',
                borderLeft: 'none',
                boxShadow: 'none',
                willChange: 'transform, backdrop-filter',
                padding: 'clamp(2rem, 5vw, 5rem)',
              }}
            >
              {/* ─── Top-Right Decorative Responsive Arcs (Isolated Composited Group) ── */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[1]"
                style={{ opacity: 0.72 }}
                aria-hidden="true"
              >
                {/* Lower Circle: Tone #22221F */}
                <div
                  className="absolute pointer-events-none z-[1]"
                  style={{
                    width: 'clamp(348px, 40.6vw, 609px)',
                    height: 'clamp(348px, 40.6vw, 609px)',
                    top: 'clamp(-130px, -13vw, -58px)',
                    right: 'clamp(-319px, -32vw, -188px)',
                    borderRadius: '50%',
                    background: '#22221F',
                    transform: 'translateZ(0)',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />

                {/* Upper Circle: Tone #3A3A37 (Opaquely occludes lower circle within group) */}
                <div
                  className="absolute pointer-events-none z-[2]"
                  style={{
                    width: 'clamp(522px, 63.8vw, 942px)',
                    height: 'clamp(522px, 63.8vw, 942px)',
                    top: 'clamp(-551px, -58vw, -377px)',
                    right: 'clamp(-609px, -65vw, -420px)',
                    borderRadius: '58% 42% 62% 38% / 60% 40% 62% 38%',
                    background: '#3A3A37',
                    transform: 'translateZ(0)',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              </div>

              {/* ─── Content Container (Warm Cream Typography) ────────────────── */}
              <div className="relative z-[10] w-full h-full flex flex-col justify-between pointer-events-none">
                {/* Top Spacer */}
                <div />

                {/* Main Navigation Links (Right-Center Column) */}
                <div className="w-full flex justify-end items-center my-auto pointer-events-auto">
                  <div
                    className="w-full max-w-xl md:max-w-2xl text-left"
                    style={{
                      paddingRight: 'clamp(0rem, 3vw, 4rem)',
                    }}
                  >
                    <nav className="flex flex-col space-y-1 sm:space-y-2">
                      {navLinks.map((link) => (
                        <div key={link.label}>
                          <button
                            onClick={() => handleLinkClick(link.href)}
                            className="group relative inline-flex flex-col text-left focus:outline-none cursor-pointer py-0.5"
                            style={{ color: '#e8e8e3' }}
                          >
                            <span
                              className="block font-black uppercase text-left tracking-tight"
                              style={{
                                fontFamily:
                                  "var(--font-sans), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                                lineHeight: 1.15,
                                letterSpacing: '-0.025em',
                                fontWeight: 900,
                                color: '#e8e8e3',
                              }}
                            >
                              {link.label}
                            </span>

                            {/* Thin Cream Underline Expanding Left-to-Right on Hover */}
                            <span
                              className="block w-full h-[1.5px] bg-[#e8e8e3] origin-left transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] scale-x-0 group-hover:scale-x-100 mt-1"
                            />
                          </button>
                        </div>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Bottom Footer Details */}
                <div className="w-full flex justify-end pointer-events-auto">
                  <div
                    className="w-full max-w-xl md:max-w-2xl flex flex-col items-start gap-4 text-left"
                    style={{
                      paddingRight: 'clamp(0rem, 3vw, 4rem)',
                    }}
                  >
                    {/* Email Section with Roll Hover */}
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-[11px] uppercase tracking-wider font-mono"
                        style={{ color: '#8A867A' }}
                      >
                        EMAIL ADDRESS
                      </span>
                      <a
                        href="mailto:contact@zunedaalim.com"
                        className="group relative inline-block overflow-hidden text-xs sm:text-sm font-mono focus:outline-none cursor-pointer"
                        style={{ color: '#e8e8e3' }}
                      >
                        <span className="block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                          contact@zunedaalim.com
                        </span>
                        <span className="absolute top-0 left-0 block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-full group-hover:translate-y-0 text-[#e8e8e3]">
                          contact@zunedaalim.com
                        </span>
                      </a>
                    </div>

                    {/* Social Links Row with Roll Hover */}
                    <div className="flex items-center gap-6 pt-1">
                      {socialLinks.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative inline-block overflow-hidden text-xs sm:text-sm font-mono focus:outline-none cursor-pointer"
                          style={{ color: '#e8e8e3' }}
                        >
                          <span className="block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                            {s.label}
                          </span>
                          <span className="absolute top-0 left-0 block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-full group-hover:translate-y-0 text-[#e8e8e3]">
                            {s.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
