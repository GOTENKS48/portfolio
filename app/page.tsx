'use client'

import { useState, useEffect } from 'react'
import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import WorksSection from '@/components/WorksSection'
import SkillsSection from '@/components/SkillsSection'
import ContactSection from '@/components/ContactSection'
import ContactReveal from '@/components/ContactReveal'
import SmoothScroll from '@/components/SmoothScroll'
import NavOverlay from '@/components/NavOverlay'

export default function Home() {
  const [shouldRevealHero, setShouldRevealHero] = useState(false)
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false)

  useEffect(() => {
    const isRestoring =
      document.documentElement.classList.contains('is-restoring-scroll') ||
      parseInt(sessionStorage.getItem('portfolio_scroll_y') || '0', 10) > 50

    if (isRestoring) {
      setIsPreloaderComplete(true)
      setShouldRevealHero(true)
      document.documentElement.classList.remove('is-restoring-scroll')
    }
  }, [])

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
      setShowHamburger(sy > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // When preloader completes, refresh ScrollTrigger so all layout measurements are accurate
  useEffect(() => {
    if (isPreloaderComplete) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          const st = (window as any).ScrollTrigger
          if (st) st.refresh()
          window.dispatchEvent(new Event('scroll'))
        }
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [isPreloaderComplete])

  return (
    <main className="relative">
      <div id="home" className="absolute top-0 left-0 w-full h-px pointer-events-none" aria-hidden="true" />
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

      <ServicesSection />

      {/* WorksSection contains GSAP scroll pinning, observed independently */}
      <WorksSection />

      <SkillsSection />

      <ContactReveal>
        <ContactSection />
      </ContactReveal>

      {/* Floating scroll-triggered navigation overlay & toggle button */}
      <NavOverlay />
    </main>
  )
}
