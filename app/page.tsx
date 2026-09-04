'use client'

import { useState, useEffect } from 'react'
import { useMotionValue, useTransform } from 'framer-motion'
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

  // ─── Velocity-based glass inertia for "What I Do" (Hero transition only) ─────
  const servicesY = useMotionValue(150)
  const servicesTransform = useTransform(
    servicesY,
    (v) => (Math.abs(v) < 0.05 ? 'none' : `translate3d(0, ${v}px, 0)`)
  )

  useEffect(() => {
    if (vh === 0) return

    const FRICTION = 0.88
    const INJECTION = 0.06
    const DRIFT_PULL = 0.06
    const REST = 0.1

    let y = 150
    let vel = 0
    let prevSY = window.scrollY
    let animId: number

    const loop = () => {
      const sy = window.scrollY
      const scrollDelta = sy - prevSY
      prevSY = sy

      if (sy >= vh) {
        // Once past hero, clamp firmly to 0 so sticky cards never rebound or jitter
        if (y !== 0 || vel !== 0) {
          y = 0
          vel = 0
          servicesY.set(0)
        }
      } else {
        // Natural target: 150px when hero fills viewport, 0 when hero scrolled past
        const progress = Math.min(1, Math.max(0, sy / vh))
        const targetY = 150 * (1 - progress)

        // Inject velocity only while transitioning through hero
        vel += (-scrollDelta * (150 / vh)) * INJECTION
        vel *= FRICTION
        y += vel
        y += (targetY - y) * DRIFT_PULL

        if (Math.abs(targetY - y) < REST && Math.abs(vel) < REST) {
          y = targetY
          vel = 0
        }

        // Clamp y between 0 and 150 — guarantees no negative undershoot (rebounding)
        y = Math.max(0, Math.min(150, y))
        servicesY.set(Math.round(y * 100) / 100)
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [vh, servicesY])

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
      />
      <HeroSection
        triggerReveal={shouldRevealHero}
        isScrolled={isScrolled}
      />

      <ServicesSection style={{
        transform: servicesTransform,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
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
