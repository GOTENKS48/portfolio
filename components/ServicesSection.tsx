'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, MotionStyle } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '@/lib/data'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

const cardFade = {
  hidden: { opacity: 0 },
  visible: (d: number = 0) => ({
    opacity: 1,
    transition: { delay: d, duration: 0.6, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

// ─── Hero Title Style Letter Mask Variants ──────────────────────────────────
const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.08,
    },
  },
}

const letterVariants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      type: 'tween' as const,
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// ─── "Available For Work" Style Subtext Variants ────────────────────────────
const descTextVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const badgeTextVariants = {
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

// Sub-items for each service, styled as numbered list rows exactly like reference
const serviceSubItems: Record<string, string[]> = {
  '01': ['React, Node.js, Express.js', 'REST APIs, PostgreSQL, Docker', 'Kafka, Redis, Microservices'],
  '02': ['Next.js, TypeScript, GSAP', 'Framer Motion, Tailwind CSS', 'Component systems, Accessibility'],
  '03': ['Data Structures & Algorithms', 'System Design, Caching', 'Performance Profiling, Pipelines'],
}

interface ServicesSectionProps {
  style?: MotionStyle
}

export default function ServicesSection({ style }: ServicesSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const deckContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!deckContainerRef.current) return

    let top1 = 0
    let top3 = 0
    let step = 0
    let wasPushed = false

    const updateMetrics = () => {
      const card1 = cardRefs.current[0]
      const card3 = cardRefs.current[2]
      if (!card1 || !card3) return
      top1 = parseFloat(window.getComputedStyle(card1).top) || 0
      top3 = parseFloat(window.getComputedStyle(card3).top) || 0
      step = (top3 - top1) / 2
    }

    updateMetrics()

    const onScrollUpdate = () => {
      const card1 = cardRefs.current[0]
      const card2 = cardRefs.current[1]
      const card3 = cardRefs.current[2]
      if (!card1 || !card2 || !card3 || top3 === 0) return

      const rect3 = card3.getBoundingClientRect()
      const p = top3 - rect3.top

      if (p > 0.5) {
        wasPushed = true
        const y1 = -Math.min(2 * step, p)
        const y2 = -Math.min(step, p)
        card1.style.transform = `translate3d(0, ${y1}px, 0)`
        card2.style.transform = `translate3d(0, ${y2}px, 0)`
      } else if (wasPushed) {
        card1.style.transform = ''
        card2.style.transform = ''
        wasPushed = false
      }
    }

    onScrollUpdate()

    const st = ScrollTrigger.create({
      trigger: deckContainerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: onScrollUpdate,
      onRefresh: () => {
        updateMetrics()
        onScrollUpdate()
      },
    })

    window.addEventListener('resize', updateMetrics, { passive: true })

    return () => {
      st.kill()
      window.removeEventListener('resize', updateMetrics)
      const card1 = cardRefs.current[0]
      const card2 = cardRefs.current[1]
      if (card1) card1.style.transform = ''
      if (card2) card2.style.transform = ''
    }
  }, [])

  return (
    <motion.section
      id="services"
      ref={ref}
      style={{
        background: '#000000',
        borderRadius: '2rem 2rem 0 0',
        marginTop: 'clamp(-7.5rem, -12vh, -6rem)',
        position: 'relative',
        zIndex: 20,
        ...style,
      }}
      className="section-pad what-i-do-section"
      data-services-panel
    >
      <div id="what-i-do" className="absolute -top-10 left-0 pointer-events-none" tabIndex={-1} aria-hidden="true" />
      <div
        className="content-width"
        style={{
          paddingTop: 'var(--section-py-top)',
          paddingBottom: 'var(--section-py-bottom)',
        }}
      >
        {/* Section header */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-start">
            {/* Row 1, Col 1: WHAT I DO / */}
            <motion.h2
              variants={titleContainerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              aria-label="WHAT I DO /"
              className="font-black uppercase flex-shrink-0"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 7rem)',
                lineHeight: '0.9',
                letterSpacing: '-0.04em',
                color: '#f1f0ed',
                display: 'inline-block',
              }}
            >
              <span style={{ display: 'inline-block' }}>
                {'WHAT I DO /'.split('').map((char, i) => {
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
            </motion.h2>

            {/* Row 1, Col 2: Spacer / Empty */}
            <div className="hidden lg:block" aria-hidden="true" />

            {/* Row 2, Col 2: (SERVICES) and text - top matches WHAT I DO / bottom, horizontally starts where WHAT I DO / ends */}
            <div className="lg:col-start-2 flex flex-col sm:flex-row sm:items-baseline gap-6 sm:gap-12 lg:gap-16 max-w-2xl">
              <div style={{ overflow: 'hidden' }} className="flex-shrink-0">
                <motion.span
                  variants={badgeTextVariants}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="text-xs tracking-widest uppercase block"
                  style={{ color: '#6b6b6b', fontFamily: 'monospace' }}
                >
                  (SERVICES)
                </motion.span>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <motion.p
                  variants={descTextVariants}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="text-sm sm:text-base leading-relaxed text-left"
                  style={{ color: '#6b6b6b' }}
                >
                  I build fast, reliable, and beautiful digital products — from backend systems to polished frontends.
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Service items — sticky stacking card deck */}
        <div
          ref={deckContainerRef}
          className="relative"
          style={{ paddingBottom: 'clamp(2rem, 4vh, 3.5rem)' }}
        >
          {services.map((service, i) => (
            <motion.div
              ref={(el) => {
                cardRefs.current[i] = el as HTMLDivElement | null
              }}
              key={service.number}
              custom={0.15 + i * 0.15}
              variants={cardFade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="sticky"
              style={{
                top: `calc(clamp(4.5rem, 7vh, 5.5rem) + ${i} * clamp(4.25rem, 7.5vh, 5.25rem))`,
                zIndex: i + 1,
                background: '#000000',
              }}
            >
              <ServiceItem service={service} index={i} />
            </motion.div>
          ))}

          {/* Calibrated scroll runway so Card (03) stacks smoothly then cards cleanly transition into WorksSection */}
          <div style={{ height: 'clamp(8rem, 14vh, 12rem)' }} aria-hidden="true" />
        </div>
      </div>
    </motion.section>
  )
}

function ServiceItem({ service, index }: { service: typeof services[0]; index: number }) {
  const subItems = serviceSubItems[service.number] || []

  return (
    <div
      className="pt-1 sm:pt-1.5 md:pt-2 pb-10 sm:pb-12 md:pb-14 grid grid-cols-1 md:grid-cols-[minmax(120px,160px)_1fr] gap-3 sm:gap-4 md:gap-12 items-start"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.12)',
        background: '#000000',
      }}
    >
      {/* Number — large, left column */}
      <div className="flex-shrink-0">
        <span
          className="font-black block"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            color: 'rgba(241,240,237,0.3)',
            letterSpacing: '-0.04em',
            lineHeight: '1.1',
            fontFamily: 'monospace',
          }}
        >
          ({service.number})
        </span>
      </div>

      {/* Content — right column */}
      <div>
        <h3
          className="font-bold mb-4"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: '#f1f0ed',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
          }}
        >
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed mb-8" style={{ color: '#6b6b6b', maxWidth: '520px' }}>
          {service.description}
        </p>

        {/* Numbered sub-items — exactly like reference */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {subItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span
                className="flex-shrink-0 text-xs"
                style={{ color: '#4a4a4a', fontFamily: 'monospace', minWidth: '24px' }}
              >
                0{i + 1}
              </span>
              <span
                className="font-bold"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.4rem)', color: '#f1f0ed', letterSpacing: '-0.02em' }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
