export function scrollToSection(href: string) {
  if (typeof window === 'undefined') return

  const lenis = (window as any).__lenis

  if (href === '#home') {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        lenis.scrollTo(targetY, { duration: 1.2 })
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
      return
    }

    if (contactSection) {
      if (lenis) {
        lenis.scrollTo(contactSection, { duration: 1.2 })
      } else {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
  }

  const target = document.querySelector(href) as HTMLElement | null
  if (target) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
