'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
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

// ─── Subtext Variants (matching ServicesSection) ────────────────────────────
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

// ─── Scramble Text Animation Hook ──────────────────────────────────────────
const SCRAMBLE_GLYPHS = 'ABCDEF0123456789!<>-_\\/[]{}—=+*^?#~'

function useScrambleText(
  text: string,
  duration: number = 1000,
  scrambleBurst: number = 240
) {
  const [displayText, setDisplayText] = useState(text)
  const animFrameRef = useRef<number | null>(null)

  const scramble = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }

    const startTime = performance.now()

    const update = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      let settledCount = 0
      if (elapsed > scrambleBurst) {
        const resolveElapsed = elapsed - scrambleBurst
        const resolveDuration = Math.max(duration - scrambleBurst, 1)
        const resolveProgress = Math.min(resolveElapsed / resolveDuration, 1)
        const easedProgress = 1 - Math.pow(1 - resolveProgress, 2.2)
        settledCount = Math.floor(easedProgress * text.length)
      }

      let result = ''
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (char === ' ' || char === '/') {
          result += char
        } else if (i < settledCount) {
          result += char
        } else {
          result +=
            SCRAMBLE_GLYPHS[
            Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
            ]
        }
      }

      setDisplayText(result)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(update)
      } else {
        setDisplayText(text)
      }
    }

    animFrameRef.current = requestAnimationFrame(update)
  }, [text, duration, scrambleBurst])

  useEffect(() => {
    setDisplayText(text)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [text])

  return { displayText, scramble }
}

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.25, margin: '0px 0px -40px 0px' })
  const [activeIdx, setActiveIdx] = useState(0)

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

      const digitEl = unitDigitBoxRef.current?.querySelector('span')
      const digitH =
        digitEl?.getBoundingClientRect().height ||
        unitDigitBoxRef.current?.getBoundingClientRect().height ||
        unitDigitBoxRef.current?.clientHeight || 0

      if (digitH > 0 && unitDigitReelRef.current) {
        currentIdx = targetIdx
        if (immediate) {
          gsap.set(unitDigitReelRef.current, {
            y: -targetIdx * digitH,
            force3D: true,
          })
        } else {
          gsap.to(unitDigitReelRef.current, {
            y: -targetIdx * digitH,
            duration: 0.8,
            ease: 'power2.out',
            force3D: true,
            overwrite: 'auto',
          })
        }
      }
    }

    // Accurate scroll threshold tracker: determines which project card has crossed the trigger line
    const getActiveProjectIdx = () => {
      const viewportTrigger = window.innerHeight * 0.55
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

    // Direct scroll listeners ensure numbers 01, 02, 03, 04, 05 update on every scroll frame
    window.addEventListener('scroll', updateActiveProject, { passive: true })

    const lenis = (window as any).__lenis
    if (lenis) {
      lenis.on('scroll', updateActiveProject)
    }

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
      window.removeEventListener('scroll', updateActiveProject)
      if (lenis) {
        lenis.off('scroll', updateActiveProject)
      }
      ctx.revert()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      id="works"
      ref={sectionRef}
      style={{ background: '#080807', position: 'relative', zIndex: 20 }}
      className="section-pad"
    >
      {/* ─── RESTORED HEADING WITH GENEROUS SPACE BEFORE FIRST PROJECT ──────── */}
      <div
        ref={headerRef}
        className="content-width"
        style={{
          paddingTop: 'clamp(2rem, 4vh, 3.5rem)',
          paddingBottom: 'clamp(3.5rem, 8vh, 6.5rem)', // Reduced vertical space before first project
        }}
      >
        <motion.h2
          variants={titleContainerVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          aria-label="SELECTED WORKS /"
          className="uppercase"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 90px)',
            fontWeight: 600,
            lineHeight: '0.9',
            letterSpacing: '-0.04em',
            color: 'rgb(209, 209, 199)',
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
          className="mt-10 sm:mt-12 lg:mt-16 ml-auto flex flex-col sm:flex-row sm:items-baseline gap-6 sm:gap-10 lg:gap-12"
          style={{ width: 'min(1050px, 68vw)' }}
        >
          <div className="flex-shrink-0 px-0.5">
            <span
              className="tracking-widest uppercase block select-none"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'rgb(126, 118, 108)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              (PROJECTS)
            </span>
          </div>
          <div style={{ overflow: 'hidden', maxWidth: '480px' }}>
            <motion.p
              variants={descTextVariants}
              initial="hidden"
              animate={headerInView ? 'visible' : 'hidden'}
              className="leading-relaxed text-left"
              style={{
                fontSize: 'clamp(1.1rem, 1.5vw, 24px)',
                fontWeight: 500,
                color: 'rgb(162, 158, 154)',
                lineHeight: 1.45,
              }}
            >
              Thoughtfully crafted digital experiences that blend utility and aesthetics into something functional,memorable,and refined.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ─── MAIN WORKS CONTAINER: TOP-LEFT STICKY NUMBER + WHOLE LONG PAGE ─── */}
      <div className="content-width flex items-start justify-between gap-8 lg:gap-16 relative">
        {/* LEFT: SHIFTED TO TOP LEFT, CLOSER TO TOP, NEVER CLIPPED, STARTS WITH 01 */}
        <div
          className="sticky flex-shrink-0 select-none z-20 self-start"
          style={{
            top: 'clamp(15px, 2vh, 30px)', // Closer to top
            width: 'auto',
          }}
        >
          <div
            className="leading-none select-none flex items-baseline"
            style={{
              fontSize: 'clamp(140px, 22vw, 422px)',
              fontWeight: 400,
              color: 'rgb(162, 158, 154)',
              letterSpacing: '-0.03em',
              lineHeight: '0.85',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {/* Tens Digit: Stationary Dotted Zero */}
            <span className="relative inline-flex items-center justify-center flex-shrink-0">
              0
              <span
                className="absolute rounded-[1px] pointer-events-none"
                style={{
                  backgroundColor: 'currentColor',
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
            width: 'min(1050px, 68vw)',
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

      {/* Breathing space before Skills section, outside the sticky container so 05 unpins flush with project 05 */}
      <div style={{ height: 'clamp(8rem, 16vh, 14rem)' }} aria-hidden="true" />

      {/* View follower that stays stationary during scroll and tracks cards */}
      <CursorFollowerElement label="View" />
    </section>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const infoRowRef = useRef<HTMLDivElement>(null)
  const isInfoInView = useInView(infoRowRef, {
    margin: '0px 0px -37.5px 0px',
    amount: 'some',
  })

  const { displayText: displayTitle, scramble: scrambleTitle } = useScrambleText(
    project.title,
    1050,
    250
  )
  const { displayText: displaySubtitle, scramble: scrambleSubtitle } =
    useScrambleText(project.subtitle, 850, 200)

  const triggerScramble = useCallback(() => {
    scrambleTitle()
    scrambleSubtitle()
  }, [scrambleTitle, scrambleSubtitle])

  const prevInViewRef = useRef(false)
  useEffect(() => {
    if (isInfoInView && !prevInViewRef.current) {
      triggerScramble()
    }
    prevInViewRef.current = isInfoInView
  }, [isInfoInView, triggerScramble])

  const projectHref =
    project.link && project.link !== '#'
      ? project.link
      : `https://example.com/project-${project.id}`

  return (
    <a
      href={projectHref}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={triggerScramble}
      className="project-card-link group w-full relative cursor-pointer flex flex-col justify-between"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
      }}
    >
      {/* Project Image Container with Overlay Video Demo Rectangle (No Hover Zoom, No Shadows/Borders) */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          height: 'clamp(750px, 75vw, 1150px)',
          background: '#1a1a1a',
        }}
      >
        {/* Base Background Image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 1050px"
          priority={project.id <= 2}
        />

        {/* Video Demo Rectangle Floating Over the Image — Clean, No Shadows/Borders */}
        {project.video && (
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 z-10 pointer-events-none">
            <div className="relative w-[96%] sm:w-[92%] lg:w-[90%] max-w-[960px] aspect-[16/10.2] rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info row — Observed with useInView so text scrambles when entering viewport */}
      <div
        ref={infoRowRef}
        className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p
            className="mb-1 select-none"
            style={{
              fontFamily: 'Consolas, monospace',
              fontSize: '16px',
              fontWeight: 500,
              color: 'rgb(162, 158, 154)',
              letterSpacing: '0.04em',
            }}
          >
            {displaySubtitle}
          </p>
          <div>
            <h3
              className="transition-colors duration-300 group-hover:text-white select-none"
              style={{
                fontFamily: 'Consolas, monospace',
                fontSize: 'clamp(1.75rem, 2.5vw, 43px)',
                fontWeight: 600,
                color: 'rgb(209, 209, 199)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              {displayTitle}
            </h3>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2.5 flex-wrap">
          <span
            className="px-3.5 py-1 rounded-full select-none"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgb(162, 158, 154)',
              border: '1px solid rgb(162, 158, 154)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {project.category}
          </span>
          <span
            className="px-3.5 py-1 rounded-full select-none"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000',
              backgroundColor: 'rgb(162, 158, 154)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {project.year}
          </span>
        </div>
      </div>
    </a>
  )
}
