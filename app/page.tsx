'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import WorksSection from '@/components/WorksSection'
import SkillsSection from '@/components/SkillsSection'
import ContactSection from '@/components/ContactSection'
import ScrollReveal from '@/components/ui/ScrollReveal'
import SmoothScroll from '@/components/SmoothScroll'
import NavOverlay from '@/components/NavOverlay'

export default function Home() {
  const [shouldRevealHero, setShouldRevealHero] = useState(false)
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false)

  const [isScrolled, setIsScrolled] = useState(false)
  const [showHamburger, setShowHamburger] = useState(false)

  // Viewport height — defines the scroll range for the Services momentum animation.
  const [vh, setVh] = useState(720)

  useEffect(() => {
    setVh(window.innerHeight)
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      setIsScrolled(sy > 5)
      setShowHamburger(sy > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ─── Velocity-based glass inertia for "What I Do" ──────────────────────────
  //
  // Physics model — fundamentally different from lerp or spring:
  //
  //   LERP  : position += (target - position) × factor
  //           → velocity is proportional to distance → Constant-Slow → Stop
  //
  //   THIS  : velocity is tracked independently, decays per frame via friction
  //           → velocity profile: Fast → Medium → Slow → Very Slow → Stop ✓
  //
  // Algorithm (runs every animation frame):
  //   1. Read scroll delta this frame → compute scroll velocity in Y-space
  //   2. Inject INJECTION fraction of that velocity into section velocity
  //      (INJECTION < 1 → section lags during active scrolling)
  //   3. Apply FRICTION → velocity decays proportionally per frame
  //   4. Advance position by velocity
  //   5. Apply DRIFT_PULL → gentle lerp toward natural target
  //      (prevents unbounded drift without killing momentum)
  //
  // Constants (tuned for snappy response):
  //   FRICTION   : 0.88  — velocity retained per frame (faster decay = snappier stop)
  //   INJECTION  : 0.06  — 6% of scroll velocity per frame
  //   DRIFT_PULL : 0.06  — 6% position correction per frame (faster convergence)
  //
  const servicesY = useMotionValue(150)
  const servicesTransform = useTransform(
    servicesY,
    (v) => (Math.abs(v) < 0.05 ? 'none' : `translate3d(0, ${v}px, 0)`)
  )

  useEffect(() => {
    if (vh === 0) return

    const FRICTION = 0.88  // velocity multiplier per frame (faster decay = snappier stop)
    const INJECTION = 0.06  // fraction of scroll velocity injected into vel
    const DRIFT_PULL = 0.06  // direct position lerp toward natural target (faster convergence)
    const REST = 0.1  // px — snap threshold when both vel and gap are tiny

    let y = 150              // current extra translateY (px)
    let vel = 0               // current velocity (px / frame)
    let prevSY = window.scrollY
    let animId: number

    const loop = () => {
      const sy = window.scrollY
      const scrollDelta = sy - prevSY
      prevSY = sy

      // Natural target: 150px when hero fills viewport, 0 when hero scrolled past
      const progress = Math.min(1, Math.max(0, sy / vh))
      const targetY = 150 * (1 - progress)

      // ── Step 1: inject scroll velocity ────────────────────────────────────
      // Converts scroll pixels to Y-space pixels via (150/vh) scale factor.
      // Negative sign: scrolling down (positive scrollDelta) reduces target Y.
      vel += (-scrollDelta * (150 / vh)) * INJECTION

      // ── Step 2: apply friction ────────────────────────────────────────────
      // Velocity decays proportionally → Fast→Medium→Slow→Stop profile.
      // This is the core difference from lerp (which decays position, not vel).
      vel *= FRICTION

      // ── Step 3: advance position by velocity ──────────────────────────────
      y += vel

      // ── Step 4: drift correction ──────────────────────────────────────────
      // Direct position pull — does NOT pass through velocity, so it cannot
      // create oscillation. Activates only after velocity has mostly decayed.
      y += (targetY - y) * DRIFT_PULL

      // ── Step 5: rest snap ─────────────────────────────────────────────────
      if (Math.abs(targetY - y) < REST && Math.abs(vel) < REST) {
        y = targetY
        vel = 0
      }

      servicesY.set(Math.round(y * 100) / 100)
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [vh, servicesY])
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <main>
      <SmoothScroll />
      {!isPreloaderComplete && (
        <Preloader
          onReveal70={() => setShouldRevealHero(true)}
          onComplete={() => setIsPreloaderComplete(true)}
        />
      )}
      <Navbar
        isScrolled={isScrolled}
        showHamburger={showHamburger}
        triggerReveal={shouldRevealHero}
        servicesY={servicesY}
      />
      <HeroSection
        triggerReveal={shouldRevealHero}
        isScrolled={isScrolled}
      />

      {/*
       * Pure velocity-based glass inertia — translateY only, no opacity or blur.
       * servicesY tracks an independent velocity variable that decays with friction,
       * creating Fast→Medium→Slow→Stop motion rather than lerp's constant-slow glide.
       */}
      <ServicesSection style={{
        transform: servicesTransform,
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }} />

      {/* WorksSection contains GSAP scroll pinning, observed independently */}
      <WorksSection />

      <ScrollReveal>
        <SkillsSection />
      </ScrollReveal>
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>

      {/* Floating scroll-triggered navigation overlay & toggle button */}
      <NavOverlay />
    </main>
  )
}
