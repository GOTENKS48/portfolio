'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/lib/data'
import { useCursorFollower, CursorFollowerElement } from './ui/CursorFollower'

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

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return
    const ctx = gsap.context(() => {
      const totalWidth = trackRef.current!.scrollWidth - window.innerWidth + 80
      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalWidth}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="works"
      ref={sectionRef}
      style={{ background: '#000000', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="section-pad" ref={headerRef}>
        <div
          className="content-width"
          style={{
            paddingTop: 'var(--section-py-top)',
            paddingBottom: 'clamp(2rem, 4vh, 3.5rem)',
          }}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            className="font-black uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              lineHeight: '0.9',
              letterSpacing: '-0.04em',
              color: '#f1f0ed',
            }}
          >
            SELECTED WORKS /
          </motion.h2>
          <motion.div
            custom={0.15}
            variants={fadeUp}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            className="mt-6 flex flex-col md:flex-row md:justify-between gap-4"
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: '#6b6b6b', fontFamily: 'monospace' }}
            >
              (PROJECTS)
            </span>
            <p className="text-base leading-relaxed max-w-xs md:text-right" style={{ color: '#6b6b6b' }}>
              Engineering work that blends architecture depth with interface precision.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div className="section-pad" style={{ paddingBottom: 'var(--section-py-bottom)' }}>
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{ width: 'max-content' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const { containerRef, followerRef, isVisible, handlers } = useCursorFollower()

  return (
    <div
      ref={containerRef}
      className="flex-shrink-0 relative"
      style={{
        width: 'min(80vw, 820px)',
        cursor: 'none',
      }}
      {...handlers}
    >
      <CursorFollowerElement
        followerRef={followerRef as React.RefObject<HTMLDivElement>}
        isVisible={isVisible}
      />

      {/* Two-column layout: giant number LEFT, image+info RIGHT — exactly like reference */}
      <div className="flex items-start gap-0">
        {/* Giant number — fluid width, hidden on very small screens */}
        <div
          className="flex-shrink-0 items-start hidden md:flex"
          style={{ width: 'clamp(100px, 15vw, 200px)' }}
        >
          <span
            className="font-black leading-none select-none"
            style={{
              fontSize: 'clamp(5rem, 14vw, 14rem)',
              color: 'rgba(241,240,237,0.12)',
              letterSpacing: '-0.06em',
              lineHeight: '0.85',
            }}
          >
            {project.number}
          </span>
        </div>

        {/* Image + info */}
        <div className="flex-1 min-w-0">
          {/* Image */}
          <div
            className="relative w-full rounded-xl overflow-hidden"
            style={{ height: 'clamp(300px, 35vw, 520px)', background: '#1a1a1a' }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 820px"
            />
          </div>

          {/* Info row — exactly like reference: category left, title center, tags right */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p
                className="text-xs mb-1 font-mono"
                style={{ color: '#6b6b6b', letterSpacing: '0.08em' }}
              >
                {project.subtitle}
              </p>
              <h3
                className="font-bold"
                style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
                  color: '#f1f0ed',
                  letterSpacing: '-0.03em',
                }}
              >
                {project.title}
              </h3>
            </div>
            <div className="flex-shrink-0 flex gap-2 flex-wrap">
              <span
                className="text-xs font-mono px-3 py-1 rounded-full border"
                style={{ color: '#6b6b6b', borderColor: 'rgba(255,255,255,0.15)' }}
              >
                {project.category}
              </span>
              <span
                className="text-xs font-mono px-3 py-1 rounded-full border"
                style={{ color: '#6b6b6b', borderColor: 'rgba(255,255,255,0.15)' }}
              >
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
