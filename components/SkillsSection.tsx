'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills } from '@/lib/data'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Hero Title Style Letter Mask Variants ──────────────────────────────────
const heroTitleVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.05,
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

const groundUp = {
  hidden: { opacity: 0, y: 55 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: d,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

// ─── Scramble Text Animation Hook (Project Names Effect) ───────────────────
const SCRAMBLE_GLYPHS = 'ABCDEF0123456789!<>-_\\/[]{}—=+*^?#~'

function useScrambleText(
  text: string,
  duration: number = 700,
  scrambleBurst: number = 160
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

function SkillItem({
  skill,
  isFramework,
  staggerDelay = 0,
}: {
  skill: string
  isFramework: boolean
  staggerDelay?: number
}) {
  const itemRef = useRef<HTMLLIElement>(null)
  const isInView = useInView(itemRef, {
    margin: '0px 0px -25px 0px',
    amount: 'some',
  })
  const { displayText, scramble } = useScrambleText(skill, 650, 150)
  const prevInViewRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isInView && !prevInViewRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        scramble()
        timeoutRef.current = null
      }, staggerDelay)
    }
    prevInViewRef.current = isInView

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isInView, scramble, staggerDelay])

  return (
    <li
      ref={itemRef}
      className="group cursor-pointer select-none"
      style={{
        fontFamily: 'Consolas, monospace',
        fontSize: '20px',
        fontWeight: 500,
      }}
    >
      <span className="relative block overflow-hidden leading-normal" style={{ color: 'rgb(162, 158, 154)' }}>
        {/* Copy 1: Rolls out upwards */}
        <span
          className="block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full"
        >
          {displayText}
        </span>
        {/* Copy 2: Rolls in upwards from bottom without highlighting */}
        <span
          className="absolute top-0 left-0 block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-full group-hover:translate-y-0"
        >
          {displayText}
        </span>
      </span>
    </li>
  )
}

const skillCategories = [
  { key: 'languages' as const, label: 'Languages & Tools' },
  { key: 'frameworks' as const, label: 'Frameworks & Libraries' },
  { key: 'concepts' as const, label: 'Core CS Concepts' },
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const skillsHeadingRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '0px 0px -50px 0px' })
  const aboutRef = useRef<HTMLDivElement>(null)
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.05 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const section = sectionRef.current
    const panel = panelRef.current
    const skillsHeading = skillsHeadingRef.current
    if (!section || !panel || !skillsHeading) return

    const isMobile = window.innerWidth < 768
    const targetScaleX = isMobile ? 0.97 : 0.95
    const targetScaleY = isMobile ? 0.995 : 0.99

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: skillsHeading,
        start: 'top 125px',
        endTrigger: section,
        end: 'bottom top',
        scrub: true,
      },
    })

    tl.to(panel, {
      scaleX: targetScaleX,
      scaleY: targetScaleY,
      ease: 'none',
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 25,
        background: 'transparent',
      }}
    >
      <div
        ref={panelRef}
        className="section-pad"
        style={{
          background: '#080807',
          width: '100%',
          transformOrigin: 'center top',
          willChange: 'transform',
          overflow: 'hidden',
          borderBottomLeftRadius: 'clamp(1.5rem, 2.5vw, 2.5rem)',
          borderBottomRightRadius: 'clamp(1.5rem, 2.5vw, 2.5rem)',
        }}
      >
        <div
          className="content-width"
          style={{
            paddingTop: 'clamp(5.5rem, 10vh, 8.5rem)',
            paddingBottom: 'var(--section-py-bottom)',
          }}
        >
          {/* Top half: DEVELOPER DESIGNER CREATOR left + Skills right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
            {/* Left: identity text — top matches Skills heading's bottom */}
            <div className="lg:pt-[clamp(1.5rem,2.75vw,2.7rem)]">
              <motion.div
                variants={heroTitleVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                {['PROBLEM SOLVER', 'DEVELOPER', 'CREATOR/'].map((word) => (
                  <p
                    key={word}
                    className="uppercase leading-none whitespace-nowrap"
                    style={{
                      fontSize: 'clamp(2rem, 4.75vw, 96px)',
                      fontWeight: 600,
                      letterSpacing: '-0.04em',
                      color: 'rgb(209, 209, 199)',
                    }}
                    aria-label={word}
                  >
                    <span style={{ display: 'inline-block' }}>
                      {word.split('').map((char, charIdx) => {
                        if (char === ' ') {
                          return (
                            <span
                              key={charIdx}
                              style={{ display: 'inline-block', width: '0.28em' }}
                              aria-hidden="true"
                            />
                          )
                        }
                        return (
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
                        )
                      })}
                    </span>
                  </p>
                ))}
              </motion.div>
            </div>

            {/* Right: Skills label placed directly above second column + 3 equal columns below */}
            <div className="w-full">
              {/* Skills heading row: aligned above column 2 on tablet/desktop, top on mobile */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
                style={{
                  marginBottom: 'clamp(3.5rem, 6vh, 5.25rem)',
                }}
              >
                <div
                  className="sm:col-start-2 flex items-start"
                  style={{
                    height: 'auto',
                  }}
                >
                  <h3
                    ref={skillsHeadingRef}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(2.5rem, 6vw, 90px)',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      color: 'rgb(209, 209, 199)',
                      lineHeight: '0.9',
                    }}
                  >
                    Skills
                  </h3>
                </div>
              </div>

              {/* 3 equally spaced columns with identical top baseline — preloaded and static */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 items-start">
                {skillCategories.map((cat, i) => (
                  <div key={cat.key}>
                    <h4
                      className="mb-4 leading-tight"
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'rgb(209, 209, 199)',
                      }}
                    >
                      {cat.label}
                    </h4>
                    <ul className="space-y-2">
                      {skills[cat.key].map((skill, itemIdx) => (
                        <SkillItem
                          key={skill}
                          skill={skill}
                          isFramework={cat.key === 'frameworks'}
                          staggerDelay={i * 75 + itemIdx * 35}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Me row — narrow image left, heading + (about me + paragraph) right */}
          <div
            ref={aboutRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start mt-24 lg:mt-32"
          >
            {/* Left Column: Narrow Image — preloaded */}
            <div className="w-full flex justify-start">
              <div
                className="relative rounded-2xl overflow-hidden w-full max-w-[362px] sm:max-w-[400px] mx-auto lg:mx-0 flex-shrink-0"
                style={{
                  height: '462.5px',
                  background: '#1a1a1a',
                }}
              >
                <Image
                  src="/images/about-profile.png?v=computer"
                  alt="Developer workspace"
                  fill
                  priority
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 1024px) 362px, 400px"
                />
              </div>
            </div>

            {/* Right column: Shifted further left in between DEVELOPER DESIGNER CREATOR heading and first column */}
            <div className="flex flex-col justify-start w-full lg:-ml-28 xl:-ml-40 lg:pr-0 xl:pr-4">
              {/* Heading aligned with image's top — comes from ground up (0s to 0.75s) */}
              <motion.h3
                custom={0}
                variants={groundUp}
                initial="hidden"
                animate={aboutInView ? 'visible' : 'hidden'}
                style={{
                  fontSize: 'clamp(1.5rem, 2.2vw, 32px)',
                  fontWeight: 500,
                  color: 'rgb(209, 209, 199)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.3',
                }}
              >
                I&apos;m a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences.
              </motion.h3>

              {/* Under this heading: About Me on left, paragraph on right with comfortable spacing */}
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-8 lg:gap-10 mt-6 lg:mt-8 items-start">
                {/* Left: About Me label — preloaded and static */}
                <div className="flex-shrink-0 sm:pt-0.5">
                  <p
                    className="tracking-widest uppercase select-none"
                    style={{
                      fontFamily: 'Consolas, monospace',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'rgb(162, 158, 154)',
                    }}
                  >
                    (ABOUT ME)
                  </p>
                </div>

                {/* Right: paragraph matching skill elements font size (text-sm), narrowed */}
                <div className="space-y-4 max-w-[480px]">
                  {/* First paragraph — appears after main line has finished appearing (0.75s to 1.50s) */}
                  <motion.p
                    custom={0.75}
                    variants={groundUp}
                    initial="hidden"
                    animate={aboutInView ? 'visible' : 'hidden'}
                    className="leading-relaxed"
                    style={{
                      fontSize: '20px',
                      fontWeight: 500,
                      color: 'rgb(162, 158, 154)',
                      lineHeight: '1.45',
                    }}
                  >
                    I&apos;m a full-stack developer focused on building scalable web applications with React, Node.js, Express, and MongoDB. I enjoy creating fast, reliable, and user-friendly products that balance clean architecture with great user experiences.
                  </motion.p>

                  {/* Second paragraph — appears after first paragraph has finished appearing (1.50s to 2.25s) */}
                  <motion.p
                    custom={1.5}
                    variants={groundUp}
                    initial="hidden"
                    animate={aboutInView ? 'visible' : 'hidden'}
                    className="leading-relaxed"
                    style={{
                      fontSize: '20px',
                      fontWeight: 500,
                      color: 'rgb(162, 158, 154)',
                      lineHeight: '1.45',
                    }}
                  >
                    Outside development, I&apos;m passionate about competitive programming and optimization, having solved 850+ problems across major coding platforms with a peak rating of 1608 (CodeChef 3★) and 1287 (Codeforces Pupil). I enjoy turning complex challenges into efficient, scalable solutions.
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
