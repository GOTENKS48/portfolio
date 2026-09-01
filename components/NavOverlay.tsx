'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { socials } from '@/lib/data'

interface NavOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: socials.linkedin },
  { label: 'GitHub', href: socials.github },
  { label: 'LeetCode', href: socials.leetcode },
]

const overlayVariants = {
  closed: {
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const },
  },
  open: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const },
  },
}

const linkVariants = {
  closed: { y: 40, opacity: 0 },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1 + i * 0.07,
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  }),
}

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  const handleLinkClick = (href: string) => {
    onClose()
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            background: 'rgba(8,8,8,0.97)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Close button */}
          <div className="flex items-center justify-between px-6 md:px-10 py-6">
            <span className="text-text-muted text-sm font-mono tracking-widest uppercase">
              Menu
            </span>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center t-150 hover:border-white/60 hover:bg-white/5 group"
              aria-label="Close menu"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="t-150 group-hover:rotate-90"
              >
                <path
                  d="M1 1L15 15M15 1L1 15"
                  stroke="#f1f0ed"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24">
            <nav className="space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="overflow-hidden"
                >
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="nav-link text-left w-full"
                  >
                    {link.label}
                  </button>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Bottom socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.4 } }}
            exit={{ opacity: 0 }}
            className="px-6 md:px-16 lg:px-24 py-8 border-t border-white/10"
          >
            <div className="flex flex-wrap gap-6 items-center">
              <span className="text-text-muted text-xs tracking-widest uppercase font-mono">
                Connect
              </span>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary text-sm font-medium hover:text-text-muted t-150 underline-offset-4 hover:underline"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
