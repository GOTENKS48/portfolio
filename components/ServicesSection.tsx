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
        background: '#111',
        borderRadius: '2rem 2rem 0 0',
        marginTop: 'clamp(-7.5rem, -12vh, -6rem)',
        position: 'relative',
        zIndex: 20,
        ...style,
      }}
      className="section-pad"
      data-services-panel
    >
      <div
        className="content-width"
        style={{
          paddingTop: 'var(--section-py-top)',
          paddingBottom: 'var(--section-py-bottom)',
        }}
      >
        {/* Section header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <h2
            className="font-black uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              lineHeight: '0.9',
              letterSpacing: '-0.04em',
              color: '#f1f0ed',
            }}
          >
            WHAT I DO /
          </h2>
          <div className="mt-8 flex flex-col md:flex-row md:justify-between gap-4">
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: '#6b6b6b', fontFamily: 'monospace' }}
            >
              (SERVICES)
            </span>
            <p className="text-base leading-relaxed max-w-xs md:text-right" style={{ color: '#6b6b6b' }}>
              I build fast, reliable, and beautiful digital products — from backend systems to polished frontends.
            </p>
          </div>
        </motion.div>

        {/* Service items — match reference layout exactly */}
        <div>
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              custom={0.15 + i * 0.15}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <ServiceItem service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function ServiceItem({ service }: { service: typeof services[0] }) {
  const subItems = serviceSubItems[service.number] || []

  return (
    <div
      className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-[minmax(120px,160px)_1fr] gap-6 md:gap-12"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
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
