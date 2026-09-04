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
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  // Digit reel refs for the stationary sticky number that rolls up only digit-wise
  const unitDigitBoxRef = useRef<HTMLDivElement>(null)
  const unitDigitReelRef = useRef<HTMLDivElement>(null)

  // Project card refs for tracking scroll position on the whole long page
  const projectCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!unitDigitBoxRef.current || !unitDigitReelRef.current) return

    let currentIdx = -1

    const rollDigitTo = (targetIdx: number) => {
      if (targetIdx === currentIdx) return
      currentIdx = targetIdx

      const digitEl = unitDigitBoxRef.current?.querySelector('span')
      const digitH =
        digitEl?.clientHeight || unitDigitBoxRef.current?.clientHeight || 0

      if (digitH > 0 && unitDigitReelRef.current) {
        gsap.to(unitDigitReelRef.current, {
          y: -targetIdx * digitH,
          duration: 0.45,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
        })
      }
    }

    // Explicitly guarantee starting at 01 immediately on mount
    rollDigitTo(0)

    // Accurate scroll threshold tracker: determines which project card has crossed the trigger line
    const updateActiveProject = () => {
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

      rollDigitTo(activeIdx)
    }

    const ctx = gsap.context(() => {
      // Main tracker trigger across the works section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: updateActiveProject,
        onEnter: () => rollDigitTo(0),
        onEnterBack: updateActiveProject,
        onLeaveBack: () => rollDigitTo(0),
      })
    })

    // Initial check
    updateActiveProject()

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
      style={{ background: '#000000', position: 'relative' }}
      className="section-pad"
    >
      {/* ─── RESTORED HEADING WITH GENEROUS SPACE BEFORE FIRST PROJECT ──────── */}
      <div
        className="content-width"
        ref={headerRef}
        style={{
          paddingTop: 'var(--section-py-top)',
          paddingBottom: 'clamp(6rem, 14vh, 11rem)', // Generous space between heading text and first project
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
          <p
            className="text-base leading-relaxed max-w-xs md:text-right"
            style={{ color: '#6b6b6b' }}
          >
            Engineering work that blends architecture depth with interface precision.
          </p>
        </motion.div>
      </div>

      {/* ─── MAIN WORKS CONTAINER: TOP-LEFT STICKY NUMBER + WHOLE LONG PAGE ─── */}
      <div className="content-width flex items-start justify-between gap-8 lg:gap-16 relative">
        {/* LEFT: SHIFTED TO TOP LEFT, NEVER CLIPPED, STARTS WITH 01 */}
        <div
          className="sticky flex-shrink-0 select-none z-20 self-start"
          style={{
            top: 'clamp(60px, 9vh, 96px)', // Shifted to top left
            width: 'auto',
          }}
        >
          <div
            className="font-black leading-none select-none flex items-baseline"
            style={{
              fontSize: 'clamp(5.5rem, 15vw, 14rem)',
              color: '#8E8B82',
              letterSpacing: '-0.06em',
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
                  width: '0.14em',
                  height: '0.14em',
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

        {/* RIGHT: WHOLE LONG PAGE VERTICAL PROJECTS (No upper/lower border, reduced width) */}
        <div
          className="flex flex-col gap-28 sm:gap-36 lg:gap-44"
          style={{
            width: 'min(620px, 56vw)',
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
    </section>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const { containerRef, followerRef, isVisible, handlers } = useCursorFollower()

  return (
    <div
      ref={containerRef}
      className="w-full relative cursor-none flex flex-col justify-between"
      {...handlers}
    >
      <CursorFollowerElement
        followerRef={followerRef as React.RefObject<HTMLDivElement>}
        isVisible={isVisible}
        label="View"
      />

      {/* Image Container — No upper or lower clipping borders */}
      <div
        className="relative w-full rounded-2xl overflow-hidden group shadow-2xl"
        style={{
          height: 'clamp(300px, 38vw, 460px)',
          background: '#1a1a1a',
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, 620px"
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
          <h3
            className="font-bold"
            style={{
              fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)',
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
  )
}
