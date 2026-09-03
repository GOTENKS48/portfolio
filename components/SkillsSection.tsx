'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { skills } from '@/lib/data'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

const skillCategories = [
  { key: 'languages' as const, label: 'Languages & Tools' },
  { key: 'frameworks' as const, label: 'Frameworks & Libraries' },
  { key: 'concepts' as const, label: 'Core CS Concepts' },
]

export default function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      ref={ref}
      style={{
        background: '#000000',
        position: 'relative',
        zIndex: 10,
      }}
      className="section-pad"
    >
      <div
        className="content-width"
        style={{
          paddingTop: 'var(--section-py-top)',
          paddingBottom: 'var(--section-py-bottom)',
        }}
      >
        {/* Top half: DEVELOPER DESIGNER CREATOR left + Skills header right */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Left: identity text */}
          <div>
            {['DEVELOPER', 'DESIGNER', 'CREATOR/'].map((word) => (
              <p
                key={word}
                className="font-black uppercase leading-none"
                style={{
                  fontSize: 'clamp(2.5rem, 6.5vw, 6.5rem)',
                  letterSpacing: '-0.04em',
                  color: '#f1f0ed',
                }}
              >
                {word}
              </p>
            ))}
          </div>

          {/* Right: Skills label + responsive grid */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                className="font-black mb-10"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 5rem)',
                  letterSpacing: '-0.04em',
                  color: '#f1f0ed',
                  lineHeight: '0.9',
                }}
              >
                Skills
              </h3>

              {/* Responsive skills grid: 1-col mobile, 2-col tablet, 3-col desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillCategories.map((cat, i) => (
                  <motion.div
                    key={cat.key}
                    custom={0.2 + i * 0.1}
                    variants={fadeUp}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                  >
                    <h4
                      className="font-bold mb-4 leading-tight"
                      style={{ color: '#f1f0ed', fontSize: '0.85rem' }}
                    >
                      {cat.label}
                    </h4>
                    <ul className="space-y-2">
                      {skills[cat.key].map((skill) => (
                        <li
                          key={skill}
                          className="text-sm"
                          style={{
                            color: '#6b6b6b',
                            fontFamily: cat.key === 'frameworks' ? 'monospace' : 'inherit',
                          }}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Me row — image left, bio right */}
        <motion.div
          custom={0.4}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 pt-16"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Image */}
          <div
            className="relative rounded-2xl overflow-hidden w-full"
            style={{
              aspectRatio: '2.5',
              maxHeight: '280px',
              background: '#1a1a1a'
            }}
          >
            <Image
              src="/images/hero-profile.png"
              alt="Jitendra Kumar"
              fill
              className="object-cover grayscale"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col justify-center">
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: '#6b6b6b', fontFamily: 'monospace' }}
            >
              (About Me)
            </p>
            <p
              className="text-xl md:text-2xl font-medium leading-snug"
              style={{ color: '#f1f0ed', letterSpacing: '-0.02em' }}
            >
              I&apos;m a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences.
            </p>
            <div className="flex gap-8 mt-8">
              <div>
                <p className="font-black text-2xl" style={{ color: '#f1f0ed' }}>3+</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#6b6b6b', fontFamily: 'monospace' }}>Years Exp</p>
              </div>
              <div>
                <p className="font-black text-2xl" style={{ color: '#f1f0ed' }}>15+</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#6b6b6b', fontFamily: 'monospace' }}>Projects</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
