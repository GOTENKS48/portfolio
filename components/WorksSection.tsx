'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/lib/data'
import { CursorFollowerElement } from './ui/CursorFollower'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Hero Title Style Letter Mask Variants ──────────────────────────────────
const headingWords = [
  { text: 'SELECTED', spaceAfter: true },
  { text: 'WORKS', spaceAfter: true },
  { text: '/', spaceAfter: false },
]

const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
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
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// ─── Subtext Variants (matching ServicesSection) ────────────────────────────
const descTextVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.28,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const badgeTextVariants = {
  hidden: { opacity: 0, y: 24 },
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

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // Digit reel refs for the stationary sticky number that rolls up only digit-wise
  const unitDigitBoxRef = useRef<HTMLDivElement>(null)
  const unitDigitReelRef = useRef<HTMLDivElement>(null)

  // Project card refs for tracking scroll position on the whole long page
  const projectCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!unitDigitBoxRef.current || !unitDigitReelRef.current) return

    let currentIdx = -1

    const rollDigitTo = (targetIdx: number, immediate: boolean = false) => {
      if (targetIdx === currentIdx && !immediate) return
      currentIdx = targetIdx

      const digitEl = unitDigitBoxRef.current?.querySelector('span')
      const digitH =
        digitEl?.clientHeight || unitDigitBoxRef.current?.clientHeight || 0

      if (digitH > 0 && unitDigitReelRef.current) {
        if (immediate) {
          gsap.set(unitDigitReelRef.current, {
            y: -targetIdx * digitH,
            force3D: true,
          })
        } else {
          gsap.to(unitDigitReelRef.current, {
            y: -targetIdx * digitH,
            duration: 0.45,
            ease: 'power2.out',
            force3D: true,
            overwrite: 'auto',
          })
        }
      }
    }

    // Accurate scroll threshold tracker: determines which project card has crossed the trigger line
    const getActiveProjectIdx = () => {
      const viewportTrigger = window.innerHeight * 0.52
      let activeIdx = 0

      projectCardRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        // If this card's top has scrolled up past the viewport trigger point
        if (rect.top <= viewportTrigger) {
          activeIdx = idx
        }
      })

      return activeIdx
    }

    const updateActiveProject = () => {
      rollDigitTo(getActiveProjectIdx())
    }

    // Explicitly set the initial digit immediately on mount according to restored scroll position
    rollDigitTo(getActiveProjectIdx(), true)

    const ctx = gsap.context(() => {
      // Main tracker trigger across the works section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: updateActiveProject,
        onEnter: () => rollDigitTo(getActiveProjectIdx()),
        onEnterBack: updateActiveProject,
        onLeaveBack: () => rollDigitTo(0),
      })
    })

    ScrollTrigger.refresh()

    const onResize = () => {
      ScrollTrigger.refresh()
      updateActiveProject()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      id="works"
      ref={sectionRef}
      style={{ background: '#000000', position: 'relative', zIndex: 20 }}
      className="section-pad"
    >
      {/* ─── RESTORED HEADING WITH GENEROUS SPACE BEFORE FIRST PROJECT ──────── */}
      <motion.div
        className="content-width"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        style={{
          paddingTop: 'var(--section-py-top)',
          paddingBottom: 'clamp(6rem, 14vh, 11rem)', // Generous space between heading text and first project
        }}
      >
        <motion.h2
          variants={titleContainerVariants}
          aria-label="SELECTED WORKS /"
          className="font-black uppercase"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 7rem)',
            lineHeight: '0.9',
            letterSpacing: '-0.04em',
            color: '#f1f0ed',
          }}
        >
          {headingWords.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.text.split('').map((char, charIdx) => (
                <span
                  key={charIdx}
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
              ))}
              {word.spaceAfter && (
                <span
                  style={{ display: 'inline-block', width: '0.28em' }}
                  aria-hidden="true"
                />
              )}
            </span>
          ))}
        </motion.h2>

        {/* Subrow: (PROJECTS) matching project card left edge, with text positioned close alongside */}
        <div
          className="mt-6 sm:mt-8 ml-auto flex flex-col sm:flex-row sm:items-baseline gap-6 sm:gap-10 lg:gap-12"
          style={{ width: 'min(840px, 68vw)' }}
        >
          <div style={{ overflow: 'hidden' }} className="flex-shrink-0 px-0.5">
            <motion.span
              variants={badgeTextVariants}
              className="text-xs tracking-widest uppercase block"
              style={{ color: '#6b6b6b', fontFamily: 'monospace' }}
            >
              (PROJECTS)
            </motion.span>
          </div>
          <div style={{ overflow: 'hidden' }} className="max-w-md">
            <motion.p
              variants={descTextVariants}
              className="text-sm sm:text-base leading-relaxed text-left"
              style={{ color: '#6b6b6b' }}
            >
              Engineering work that blends architecture depth with interface precision.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* ─── MAIN WORKS CONTAINER: TOP-LEFT STICKY NUMBER + WHOLE LONG PAGE ─── */}
      <div className="content-width flex items-start justify-between gap-8 lg:gap-16 relative">
        {/* LEFT: SHIFTED TO TOP LEFT, CLOSER TO TOP, NEVER CLIPPED, STARTS WITH 01 */}
        <div
          className="sticky flex-shrink-0 select-none z-20 self-start"
          style={{
            top: 'clamp(12px, 2vh, 24px)', // Closer to top
            width: 'auto',
          }}
        >
          <div
            className="leading-none select-none flex items-baseline"
            style={{
              fontSize: 'clamp(7.5rem, 20vw, 20rem)',
              fontWeight: 500, // Medium weight
              color: '#8E8B82',
              letterSpacing: '-0.03em',
              lineHeight: '0.85',
              fontFamily:
                'var(--font-display), "Neue Montreal", Inter, sans-serif',
            }}
          >
            {/* Tens Digit: Stationary Dotted Zero */}
            <span className="relative inline-flex items-center justify-center flex-shrink-0">
              0
              <span
                className="absolute bg-[#8E8B82] rounded-[1px] pointer-events-none"
                style={{
                  width: '0.135em',
                  height: '0.135em',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </span>

            {/* Units Digit Box: Single-character inline-block (NOT flex items-center to avoid centering offset) */}
            <div
              ref={unitDigitBoxRef}
              className="relative overflow-hidden inline-block flex-shrink-0"
              style={{
                height: '1em',
                width: '0.74em',
                lineHeight: '0.85',
                verticalAlign: 'baseline',
              }}
            >
              <div
                ref={unitDigitReelRef}
                className="flex flex-col will-change-transform w-full"
                style={{
                  transform: 'translate3d(0, 0px, 0)',
                }}
              >
                {projects.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center justify-center select-none w-full"
                    style={{
                      height: '1em',
                      lineHeight: '0.85',
                    }}
                  >
                    {p.number.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: WHOLE LONG PAGE VERTICAL PROJECTS (No upper/lower border, increased width) */}
        <div
          className="flex flex-col gap-28 sm:gap-36 lg:gap-44"
          style={{
            width: 'min(840px, 68vw)',
            paddingBottom: 'var(--section-py-bottom)',
          }}
        >
          {projects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                projectCardRefs.current[idx] = el
              }}
              className="w-full"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* View follower that stays stationary during scroll and tracks cards */}
      <CursorFollowerElement label="View" />
    </section>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const projectHref =
    project.link && project.link !== '#'
      ? project.link
      : `https://example.com/project-${project.id}`

  return (
    <a
      href={projectHref}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card-link group w-full relative cursor-pointer flex flex-col justify-between"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
      }}
    >
      {/* Image Container — No upper or lower clipping borders */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{
          height: 'clamp(600px, 75vw, 920px)',
          background: '#1a1a1a',
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 90vw, 840px"
          priority={project.id <= 2}
        />
      </div>

      {/* Info row */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p
            className="text-xs mb-1 font-mono"
            style={{ color: '#6b6b6b', letterSpacing: '0.08em' }}
          >
            {project.subtitle}
          </p>
          <div className="flex items-center gap-2">
            <h3
              className="font-bold transition-colors duration-300 group-hover:text-white"
              style={{
                fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)',
                color: '#f1f0ed',
                letterSpacing: '-0.03em',
              }}
            >
              {project.title}
            </h3>
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#8E8B82] group-hover:text-white text-base"
              aria-hidden="true"
            >
              ↗
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2 flex-wrap">
          <span
            className="text-xs font-mono px-3 py-1 rounded-full border transition-colors duration-300 group-hover:border-white/30"
            style={{ color: '#6b6b6b', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            {project.category}
          </span>
          <span
            className="text-xs font-mono px-3 py-1 rounded-full border transition-colors duration-300 group-hover:border-white/30"
            style={{ color: '#6b6b6b', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            {project.year}
          </span>
        </div>
      </div>
    </a>
  )
}
