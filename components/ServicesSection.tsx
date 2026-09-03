'use client'

import { useRef } from 'react'
import { motion, useInView, MotionStyle } from 'framer-motion'
import { services } from '@/lib/data'

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
        <div className="relative" style={{ paddingBottom: 'clamp(12rem, 25vh, 20rem)' }}>
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              custom={0.15 + i * 0.15}
              variants={cardFade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="sticky"
              style={{
                top: `calc(clamp(5rem, 8vh, 6rem) + ${i} * clamp(2.8rem, 5vh, 3.5rem))`,
                zIndex: i + 1,
                background: '#000000',
                boxShadow: i > 0 ? '0 -16px 36px rgba(0, 0, 0, 0.8)' : 'none',
              }}
            >
              <ServiceItem service={service} index={i} />
            </motion.div>
          ))}

          {/* Dedicated scroll runway spacer so Card (03) has full room to stick and pin before scrolling away */}
          <div style={{ height: 'clamp(30rem, 75vh, 50rem)' }} aria-hidden="true" />
        </div>
      </div>
    </motion.section>
  )
}

function ServiceItem({ service, index }: { service: typeof services[0]; index: number }) {
  const subItems = serviceSubItems[service.number] || []

  return (
    <div
      className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-[minmax(120px,160px)_1fr] gap-6 md:gap-12"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: '#000000',
      }}
    >
      {/* Number — large, left column */}
      <div className="flex-shrink-0">
        <span
          className="font-black"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: 'rgba(241,240,237,0.25)',
            letterSpacing: '-0.04em',
            lineHeight: '1',
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
