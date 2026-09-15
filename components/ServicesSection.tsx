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
      delay: 0.75,
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// Sub-items for each service, styled as numbered list rows exactly like reference
const serviceSubItems: Record<string, string[]> = {
  '01': ['React.js, TypeScript, Tailwind CSS', 'REST APIs, Node.js, Express.js, MongoDB', 'C++, SQL, Git & GitHub'],
  '02': [
    '850+ Problems Solved',
    'CodeChef 3★ (1608) & Codeforces pupil (1287)',
    'Ranked 374/11000+ & 1742/30,000+ globally in contests.',
  ],
  '03': ['Data Structures & Algorithms', 'DBMS, OOP, OS Fundamentals', 'Scalable Systems & Optimization'],
}

interface ServicesSectionProps {
  style?: MotionStyle
}

export default function ServicesSection({ style }: ServicesSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.25, margin: '0px 0px -40px 0px' })
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
      if (!card1 || !card2 || !card3) return
      // Cards unstick simultaneously in unison
      if (wasPushed) {
        card1.style.transform = ''
        card2.style.transform = ''
        card3.style.transform = ''
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

    window.addEventListener('scroll', onScrollUpdate, { passive: true })
    window.addEventListener('resize', updateMetrics, { passive: true })

    return () => {
      st.kill()
      window.removeEventListener('scroll', onScrollUpdate)
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
      style={{
        background: '#080807',
        borderRadius: '2rem 2rem 0 0',
        marginTop: '0',
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
          paddingBottom: 'clamp(1rem, 2vh, 2rem)',
          position: 'relative',
          left: '-clamp(8px, 0.75vw, 18px)',
        }}
      >
        {/* Section header */}
        <div ref={headerRef} className="mb-20 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-6 gap-y-12 sm:gap-y-16 lg:gap-y-20 items-start">
            {/* Row 1, Col 1: WHAT I DO / */}
            <motion.h2
              variants={titleContainerVariants}
              initial="hidden"
              animate={headerInView ? 'visible' : 'hidden'}
              aria-label="WHAT I DO /"
              className="uppercase flex-shrink-0"
              style={{
                fontSize: 'clamp(3rem, 8vw, 144px)',
                fontWeight: 600,
                lineHeight: '0.9',
                letterSpacing: '-0.04em',
                color: 'rgb(209, 209, 199)',
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

            {/* Row 2, Col 2: (SERVICES) and text */}
            <div
              className="lg:col-start-2 flex flex-col sm:flex-row sm:items-baseline gap-6 sm:gap-12 lg:gap-16 max-w-xl"
              style={{
                position: 'relative',
                left: '-clamp(4rem, 7.5vw, 11rem)',
              }}
            >
              <div className="flex-shrink-0">
                <span
                  className="tracking-widest uppercase block"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'rgb(126, 118, 108)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  (EXPERTISE)
                </span>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <motion.p
                  variants={descTextVariants}
                  initial="hidden"
                  animate={headerInView ? 'visible' : 'hidden'}
                  className="leading-relaxed text-left"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw, 24px)',
                    fontWeight: 500,
                    color: 'rgb(162, 158, 154)',
                    maxWidth: '480px',
                    lineHeight: 1.45,
                  }}
                >
                  I specialize in building scalable software systems and web applications with a focus on performance, reliability, and clean architecture. Using modern full-stack technologies and AI-powered workflows, I create efficient solutions that scale and deliver real impact.
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Service items — sticky stacking card deck */}
        <div
          ref={deckContainerRef}
          className="relative"
        >
          {services.map((service, i) => (
            <div
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              key={service.number}
              className="sticky"
              style={{
                top: `calc(clamp(8.5rem, 15vh, 11rem) + ${i} * clamp(4.5rem, 8.5vh, 6.25rem))`,
                zIndex: i + 1,
                background: '#080807',
                minHeight: `calc(100vh - (clamp(8.5rem, 15vh, 11rem) + ${i} * clamp(4.5rem, 8.5vh, 6.25rem)) + clamp(8rem, 20vh, 15rem))`,
              }}
            >
              <ServiceItem service={service} index={i} />
            </div>
          ))}

          {/* Calibrated scroll runway so Card (03) stacks smoothly then cards cleanly transition into WorksSection */}
          <div style={{ height: 'clamp(1.5rem, 3vh, 3rem)' }} aria-hidden="true" />
        </div>
      </div>
    </motion.section>
  )
}

function ServiceItem({ service, index }: { service: typeof services[0]; index: number }) {
  const subItems = serviceSubItems[service.number] || []

  return (
    <div
      className="pt-1 sm:pt-1.5 md:pt-2 pb-10 sm:pb-12 md:pb-14 relative"
      style={{
        borderTop: '1px solid rgba(126, 118, 108, 0.45)',
        background: '#080807',
      }}
    >
      {/* Number — absolutely positioned left on md+, static on mobile */}
      <div className="md:absolute md:left-0 md:top-2 flex-shrink-0 mb-3 md:mb-0">
        <span
          className="block"
          style={{
            fontSize: '57px',
            fontWeight: 600,
            color: 'rgb(209, 209, 199)',
            letterSpacing: '-0.04em',
            lineHeight: '1.1',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ({service.number})
        </span>
      </div>

      {/* Content — responsive margin left */}
      <div className="ml-0 md:ml-[clamp(14rem,32vw,36rem)]">
        <h3
          className="mb-6"
          style={{
            fontSize: '57px',
            fontWeight: 600,
            color: 'rgb(209, 209, 199)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
          }}
        >
          {service.title}
        </h3>
        <p
          className="leading-relaxed mb-4"
          style={{
            fontSize: '20px',
            fontWeight: 500,
            color: 'rgb(162, 158, 154)',
            maxWidth: '480px',
            marginLeft: '15px',
          }}
        >
          {service.description}
        </p>

        {/* Numbered sub-items — exactly like reference */}
        <div style={{ marginLeft: '15px' }}>
          {subItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-5 py-2"
              style={{ borderBottom: i < subItems.length - 1 ? '1px solid rgba(126, 118, 108, 0.45)' : 'none' }}
            >
              <span
                className="flex-shrink-0"
                style={{ fontSize: '20px', fontWeight: 500, color: 'rgb(126, 118, 108)', fontFamily: 'Consolas, monospace', minWidth: '30px' }}
              >
                0{i + 1}
              </span>
              <span
                style={{ fontSize: '32px', fontWeight: 700, color: 'rgb(191, 191, 177)', letterSpacing: '-0.02em' }}
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
