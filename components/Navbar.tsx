'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
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
}

export default function Navbar({ isScrolled = false, showHamburger = false, triggerReveal = false }: NavbarProps) {
  const { scrollY } = useScroll()

  // ── Scroll-driven header visibility ────────────────────────────────────────
  // When What I Do comes into viewport (scrollY > 30px), upper section scrolls up (-120px).
  // When What I Do goes outside viewport (scrollY <= 25px), upper section reappears (0px).
  const targetHeaderY = useTransform(scrollY, (sy: number): number => {
    return sy > 30 ? -120 : 0
  })

  const headerY = useSpring(targetHeaderY, { stiffness: 260, damping: 28, mass: 0.7 })

  // ── Scroll-driven glass panel background & blur ────────────────────────────
  const headerBg = useTransform(
    scrollY,
    [0, 25],
    ['rgba(232, 232, 227, 0)', 'rgba(232, 232, 227, 0.92)']
  )

  const headerBlur = useTransform(
    scrollY,
    [0, 25],
    ['blur(0px)', 'blur(12px)']
  )

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
          paddingLeft: 'var(--page-px)',
          paddingRight: 'var(--page-px)',
          background: headerBg,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
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

          {/* Right: navigation links */}
          <motion.div
            variants={topFadeVariants}
            initial="hidden"
            animate={triggerReveal ? 'visible' : 'hidden'}
            className="flex items-center justify-end"
          >
            <nav
              className="flex items-center"
              style={{ gap: 'clamp(1.25rem, 2.2vw, 2.75rem)' }}
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="group relative cursor-pointer"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 'clamp(0.8rem, min(1.15vw, 2.4vh), 1rem)',
                    fontWeight: 500,
                    color: '#6B645C',
                    letterSpacing: '-0.02em',
                    background: 'none',
                    border: 'none',
                    padding: 0,
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
              ))}
            </nav>
          </motion.div>
        </div>
      </motion.header>
    </>
  )
}
