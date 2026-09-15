export function scrollToSection(href: string) {
  if (typeof window === 'undefined') return

  const lenis = (window as any).__lenis
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = prefersReducedMotion ? 0 : 1.2

  if (href === '#home') {
    if (lenis) {
      lenis.scrollTo(0, { duration, immediate: prefersReducedMotion })
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
    return
  }

  if (href === '#contact') {
    const revealContainer = document.querySelector('[data-contact-reveal]') as HTMLElement | null
    const contactSection = document.querySelector('#contact') as HTMLElement | null

    if (revealContainer) {
      const vw = window.innerWidth
      const isDesktop = vw >= 1024
      const isTablet = vw >= 768 && vw < 1024
      const overlap = isDesktop ? 680 : isTablet ? 570 : 460

      // Calculate target so the contact card and 'LET'S MAKE IT HAPPEN' are framed in the viewport
      const targetY = revealContainer.offsetTop + overlap

      if (lenis) {
        lenis.scrollTo(targetY, { duration, immediate: prefersReducedMotion })
      } else {
        window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
      return
    }

    if (contactSection) {
      if (lenis) {
        lenis.scrollTo(contactSection, { duration, immediate: prefersReducedMotion })
      } else {
        contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
      return
    }
  }

  const triggerPostScrollSync = () => {
    if (typeof window !== 'undefined') {
      const st = (window as any).ScrollTrigger
      if (st) st.refresh()
      window.dispatchEvent(new Event('scroll'))
    }
  }

  const target = document.querySelector(href) as HTMLElement | null
  if (target) {
    if (lenis) {
      lenis.scrollTo(target, {
        duration,
        immediate: prefersReducedMotion,
        onComplete: () => {
          triggerPostScrollSync()
        },
      })
      setTimeout(triggerPostScrollSync, (duration * 1000) + 50)
    } else {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      setTimeout(triggerPostScrollSync, (duration * 1000) + 50)
    }
  }
}
