'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Dynamic date utility ────────────────────────────────────────────────────
function getAvailableDate(): string {
  const d = new Date()
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase()
  const year = d.getFullYear().toString().slice(-2)
  return `${month}'${year}`
}

// ─── Name string ─────────────────────────────────────────────────────────────
const NAME = 'JITENDRA KUSHWAH'

// ─── Animation variants ──────────────────────────────────────────────────────

// Container: drives per-letter stagger
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
}

// Letter: pure geometric Y-axis mask reveal
const letterVariants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      type: 'tween' as const,
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// Pre-compute variant objects (stable references, no per-render recreation)
const arrowVariants = {
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

const availableTextVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const dateVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.55,
      duration: 0.90,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const descVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.28,
      duration: 1.20,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const btnVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.72,
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// Image: "rolling from top to bottom" clip-path reveal
const imageVariants = {
  hidden: {
    clipPath: 'inset(0% 0% 100% 0%)',
  },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      delay: 0.2,
      duration: 1.1,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

interface HeroSectionProps {
  triggerReveal?: boolean
  isScrolled?: boolean
}

export default function HeroSection({ triggerReveal = false, isScrolled = false }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const heroContainerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const [isContactHovered, setIsContactHovered] = useState(false)
  const hoverTimeoutRef = useRef<any>(null)

  const curtainProgress = useMotionValue(0)

  useEffect(() => {
    animate(curtainProgress, isContactHovered ? 1 : 0, {
      duration: 0.35,
      ease: "easeInOut"
    })
  }, [isContactHovered, curtainProgress])

  const pathD = useTransform(curtainProgress, (p: number) => {
    let yCenter = 100
    let yControlLeft = 100
    let yControlRight = 100
    let yLeft = 100
    let yRight = 100

    if (p <= 0.45) {
      const t = p / 0.45
      yCenter = 100 - t * 80
      yControlLeft = 100 - t * 80
      yControlRight = 100 - t * 80
    } else {
      const t = (p - 0.45) / 0.55
      yCenter = 20 - t * 20
      yControlLeft = 20 - t * 20
      yControlRight = 20 - t * 20
      yLeft = 100 - t * 100
      yRight = 100 - t * 100
    }

    return `M 0 ${yLeft} C 0 ${yControlLeft}, 100 ${yControlRight}, 100 ${yRight} L 100 100 L 0 100 Z`
  })

  const textBaseY = useTransform(curtainProgress, [0, 0.45, 1], ['0%', '-45%', '-100%'])
  const textHoverY = useTransform(curtainProgress, [0, 0.45, 1], ['100%', '45%', '0%'])

  // ─── GSAP: Hero parallax on scroll ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = heroContainerRef.current
    const triggerEl = triggerRef.current
    if (!container || !triggerEl) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Opacity fades to 0 when what i do section has travelled 60% (progress 0.6)
    tl.to(container, {
      opacity: 0,
      duration: 0.6,
      ease: 'none',
    }, 0)

    // Scale down smoothly to 0.92 over full scroll range
    tl.to(container, {
      scale: 0.92,
      duration: 1.0,
      ease: 'none',
    }, 0)

    // Move container downwards by 150px over full scroll range for parallax depth
    tl.to(container, {
      y: 150,
      duration: 1.0,
      ease: 'none',
    }, 0)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const dateString = getAvailableDate()
  const anim = triggerReveal ? 'visible' : 'hidden'

  return (
    <>
      <div
        ref={triggerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
      <section
        id="home"
        ref={ref}
        className="sticky top-0 z-10"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          ref={heroContainerRef}
          className="w-full h-full flex flex-col"
          style={{
            background: '#e8e8e3',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        >
          {/* ── Full-bleed padded container — consistent px with Navbar ── */}
          <div
            className="w-full h-full flex flex-col justify-between"
            style={{
              paddingLeft: 'var(--page-px)',
              paddingRight: 'var(--page-px)',
              paddingTop: 'clamp(1.25rem, 1.2rem + 0.3vi, 1.75rem)',
              paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
            }}
          >

            {/*
             * ── 1. FULL-WIDTH NAME ──────────────────────────────────────────
             */}
            <div className="pt-[clamp(5.5rem,12vh,9.5rem)]">
              <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate={anim}
                aria-label={NAME}
                style={{
                  fontSize: 'clamp(2.1rem, 9.0vw, 13.5rem)',
                  lineHeight: '0.9',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  display: 'block',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  color: '#141414',
                }}
              >
                <span style={{ display: 'inline-block' }}>
                  {NAME.split('').map((char, i) => {
                    if (char === ' ') {
                      return (
                        <span
                          key={i}
                          style={{ display: 'inline-block', width: '0.28em' }}
                          aria-hidden="true"
                        />
                      )
                    }
                    return (
                      <span
                        key={i}
                        style={{
                          display: 'inline-block',
                          overflow: 'hidden',
                          verticalAlign: 'bottom',
                          lineHeight: '1.05',
                        }}
                      >
                        <motion.span
                          variants={letterVariants}
                          style={{ display: 'inline-block' }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    )
                  })}
                </span>
              </motion.h1>
            </div>

            {/*
             * ── 2. THREE-COLUMN HERO GRID (Bottom-aligned) ──────────────────
             *
             * Desktop (md+):
             *   Left   → Bottom-aligned (arrow, bio, contact button)
             *   Center → Center portrait image card (bottom-aligned with SEP'26)
             *   Right  → Available for Work + SEP'26 (bottom-aligned)
             */}
            <div
              className="hero-grid flex-1 grid w-full"
              style={{
                marginTop: 'clamp(1rem, 2.5vh, 2rem)',
                gap: 'clamp(1.25rem, 2.5vw, 2.5rem)',
              }}
            >

              {/* ── Left Column: Arrow at top edge, Bio & Contact centered in middle of image height ── */}
              <div
                className="hero-left relative flex flex-col justify-center order-2 md:order-none md:h-[clamp(260px,min(28vw,53.33vh),393.33px)]"
                style={{ gap: 'clamp(1rem, 2vh, 1.75rem)' }}
              >
                {/* ↘ Arrow icon — top-aligned flush with hero image top edge */}
                <motion.div
                  variants={arrowVariants}
                  initial="hidden"
                  animate={anim}
                  className="md:absolute md:top-0 md:left-0 mb-3 md:mb-0"
                >
                  <svg
                    style={{
                      width: 'clamp(24px, 2.3vw, 36px)',
                      height: 'clamp(24px, 2.3vw, 36px)',
                      display: 'block',
                    }}
                    viewBox="6.9 6.9 20.3 20.3"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line x1="8" y1="8" x2="26" y2="26" stroke="#8A867A" strokeWidth="2.2" strokeLinecap="round" />
                    <polyline points="8,26 26,26 26,8" fill="none" stroke="#8A867A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                {/* Middle group: Vertically centered relative to hero image height */}
                <div className="flex flex-col" style={{ gap: 'clamp(0.75rem, 1.8vh, 1.25rem)' }}>
                  {/* Bio description — clean crisp sans-serif */}
                  <div style={{ overflow: 'hidden' }}>
                    <motion.p
                      variants={descVariants}
                      initial="hidden"
                      animate={anim}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(0.875rem, 1.18vw, 1.15rem)',
                        fontWeight: 400,
                        color: '#6B645C',
                        lineHeight: 1.6,
                        letterSpacing: '-0.01em',
                        maxWidth: 'clamp(280px, 26vw, 420px)',
                      }}
                    >
                      I build fast, modern systems and interfaces that help ideas scale —
                      available for full-time and freelance projects worldwide.
                    </motion.p>
                  </div>

                  {/* CONTACT pill button — close to bio text */}
                  <div style={{ overflow: 'hidden' }}>
                    <motion.div
                      variants={btnVariants}
                      initial="hidden"
                      animate={anim}
                    >
                      <motion.a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault()
                          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        onMouseEnter={() => {
                          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                          hoverTimeoutRef.current = setTimeout(() => {
                            setIsContactHovered(true)
                          }, 120)
                        }}
                        onMouseLeave={() => {
                          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                          setIsContactHovered(false)
                        }}
                        className="relative overflow-hidden"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 'clamp(145px, 12vw, 190px)',
                          height: 'clamp(52px, 4.4vw, 68px)',
                          borderRadius: '999px',
                          background: '#393632',
                          color: '#ffffff',
                          fontSize: 'clamp(0.85rem, 1.15vw, 1.05rem)',
                          fontWeight: 700,
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: '-0.01em',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          boxShadow: 'none',
                          isolation: 'isolate',
                          overflow: 'hidden',
                          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                        }}
                      >
                        {/* Sage Green Curtain Fill Overlay */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          style={{ borderRadius: 'inherit', overflow: 'hidden' }}
                        >
                          <motion.path
                            fill="#8C8C73"
                            d={pathD}
                          />
                        </svg>

                        {/* Dual-Layer Text Rolling Wrapper */}
                        <span className="relative z-10 block overflow-hidden h-[1.3em]">
                          {/* Base Layer */}
                          <motion.span
                            className="flex items-center gap-[clamp(6px, 0.6vw, 8px)]"
                            style={{ y: textBaseY }}
                          >
                            <span>CONTACT</span>
                            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.span>

                          {/* Hover Layer */}
                          <motion.span
                            className="absolute top-0 left-0 flex items-center gap-[clamp(6px, 0.6vw, 8px)]"
                            style={{ y: textHoverY }}
                          >
                            <span>CONTACT</span>
                            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.span>
                        </span>
                      </motion.a>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/*
               * ── Center Column: Profile Image ──
               *
               * Bottom-aligned (matching SEP'26), maintaining exact position.
               */}
              <div className="hero-center flex justify-center items-end order-1 md:order-none">
                <motion.div
                  variants={imageVariants}
                  initial="hidden"
                  animate={anim}
                  className="relative rounded-2xl overflow-hidden border border-black/[0.06]"
                  style={{
                    width: 'clamp(195px, min(21vw, 40vh), 295px)',
                    aspectRatio: '3 / 4',
                  }}
                >
                  <div className="w-full h-full relative">
                    <Image
                      src="/images/hero-profile.png"
                      alt="Jitendra Kushwah"
                      fill
                      className="object-cover grayscale"
                      priority
                    />
                  </div>
                </motion.div>
              </div>

              {/*
               * ── Right Column: Available For Work + Date ──
               *
               * Scaled up, flush right, bottom-aligned with center image & contact button.
               */}
              <div
                className="hero-right flex flex-col justify-end items-end order-3 md:order-none"
              >
                {/* "AVAILABLE FOR WORK" — scaled mono label */}
                <div style={{ overflow: 'hidden' }}>
                  <motion.span
                    variants={availableTextVariants}
                    initial="hidden"
                    animate={anim}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(0.75rem, 1.05vw, 0.95rem)',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: '#6B645C',
                      marginBottom: 'clamp(6px, 0.6vw, 10px)',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                    }}
                  >
                    Available For Work
                  </motion.span>
                </div>
                {/* Date — large display typographic block */}
                <div style={{ overflow: 'hidden' }}>
                  <motion.span
                    variants={dateVariants}
                    initial="hidden"
                    animate={anim}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(3.2rem, 6.5vw, 6.8rem)',
                      fontWeight: 700,
                      color: '#393632',
                      lineHeight: '0.85',
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                    }}
                  >
                    {dateString}
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
