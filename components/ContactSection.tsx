'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

const menuLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jitendra' },
  { label: 'Github', href: 'https://github.com/jitendra' },
  { label: 'LeetCode', href: 'https://leetcode.com/jitendra' },
]

export default function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [mounted, setMounted] = useState(false)
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      try {
        const now = new Date()
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now)
        setTimeStr(formatted)
      } catch {
        const now = new Date()
        setTimeStr(now.toLocaleTimeString())
      }
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        background: '#e8e8e3',
        paddingLeft: 'clamp(0.875rem, 2.1vw, 2.1rem)',
        paddingRight: 'clamp(0.875rem, 2.1vw, 2.1rem)',
        paddingTop: '0.5rem',
      }}
    >
      {/* Dark rounded contact card — matches reference exactly */}
      <div
        className="rounded-md sm:rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #181818 0%, #0d0d0d 50%, #141414 100%)',
          paddingLeft: 'clamp(1rem, 3vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 3vw, 2.5rem)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
        }}
      >
        <div
          className="content-width"
          style={{
            paddingTop: 'var(--section-py-top)',
            paddingBottom: 'var(--section-py-bottom)',
          }}
        >
          {/* Big heading */}
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="font-black uppercase text-center"
            style={{
              fontSize: 'clamp(2.8rem, 9vw, 9.5rem)',
              letterSpacing: '-0.04em',
              color: '#f1f0ed',
              lineHeight: '0.88',
            }}
          >
            LET&apos;S MAKE<br />IT HAPPEN
          </motion.h2>

          {/* Form card */}
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-14 max-w-lg mx-auto"
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p
                className="text-center font-medium mb-8"
                style={{ color: '#f1f0ed', letterSpacing: '-0.01em' }}
              >
                Have a project in mind?
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name input */}
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono outline-none t-150"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f0ed',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono outline-none t-150"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f0ed',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <textarea
                  placeholder="Tell me about your project"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono outline-none t-150 resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f0ed',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />

                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="group relative w-full py-4 rounded-xl font-mono text-sm font-bold uppercase cursor-pointer overflow-hidden select-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    background: '#f1f0ed',
                    color: '#0d0d0d',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                  }}
                >
                  {/* Fluid liquid dark fill expanding smoothly from bottom */}
                  <span
                    className="absolute inset-0 bg-[#161614] rounded-xl transform origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100"
                    aria-hidden="true"
                  />

                  {/* Refined warm stone accent border on hover */}
                  <span
                    className="absolute inset-0 rounded-xl border border-transparent transition-colors duration-500 group-hover:border-[#8E8B82]/50 pointer-events-none z-10"
                    aria-hidden="true"
                  />

                  {/* Gentle ambient light shimmer passing across */}
                  <span
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-[320%] pointer-events-none z-20"
                    aria-hidden="true"
                  />

                  {/* Content: steady text with smooth color inversion, tracking expansion, and sliding arrow */}
                  <span className="relative z-30 flex items-center justify-center gap-2.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] tracking-wider group-hover:tracking-[0.18em] group-hover:text-[#f1f0ed]">
                    {status === 'idle' ? (
                      <>
                        <span>Get a quote</span>
                        <svg
                          className="w-4 h-4 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </>
                    ) : status === 'sending' ? (
                      'Sending...'
                    ) : (
                      '✓ Message sent!'
                    )}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer — 3-column links with generous vertical space */}
      <motion.footer
        custom={0.4}
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="w-full"
        style={{
          paddingTop: 'clamp(6rem, 13vh, 10rem)',
          paddingBottom: 'clamp(3rem, 6vh, 5rem)',
        }}
      >
        <div className="content-width">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-0 w-full">
            {/* Left: Menu — underline increases till Socials */}
            <div className="w-full max-w-[250px] md:max-w-none md:pr-10">
              <h4
                className="font-bold text-sm mb-4 pb-3"
                style={{
                  color: '#141414',
                  borderBottom: '1px solid rgba(20, 20, 20, 0.15)',
                }}
              >
                Menu
              </h4>
              <ul className="space-y-2.5 max-w-[250px]">
                {menuLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        document
                          .querySelector(link.href)
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="group relative inline-block text-sm font-medium"
                      style={{ color: '#6B645C' }}
                    >
                      <span className="relative block overflow-hidden leading-normal">
                        {/* Scroll up on hover */}
                        <span className="block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        {/* Scroll in from below on hover without color change */}
                        <span className="absolute top-0 left-0 block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-full group-hover:translate-y-0">
                          {link.label}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle: Socials — starting point is in the middle of the contact card */}
            <div className="w-full max-w-[250px]">
              <h4
                className="font-bold text-sm mb-4 pb-3"
                style={{
                  color: '#141414',
                  borderBottom: '1px solid rgba(20, 20, 20, 0.15)',
                }}
              >
                Socials
              </h4>
              <ul className="space-y-2.5">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-block text-sm font-medium"
                      style={{ color: '#6B645C' }}
                    >
                      <span className="relative block overflow-hidden leading-normal">
                        {/* Scroll up on hover */}
                        <span className="block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                          {s.label}
                        </span>
                        {/* Scroll in from below on hover without color change */}
                        <span className="absolute top-0 left-0 block transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-full group-hover:translate-y-0">
                          {s.label}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom row: Empty spacer (Left), Local Time (Center), Arrow Button (Bottom Right) */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            {/* Left: Spacer to keep center alignment balanced */}
            <div className="hidden md:block" aria-hidden="true" />

            {/* In between at the bottom: Local Time — stacked on top of actual time */}
            <div className="flex flex-col items-center justify-center gap-0.5 text-center font-mono order-1 md:order-2">
              <span
                className="text-[12.5px] uppercase tracking-wider"
                style={{ color: 'rgba(20, 20, 20, 0.5)' }}
              >
                LOCAL TIME
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: 'rgba(20, 20, 20, 0.8)' }}
              >
                {mounted && timeStr ? timeStr : '11:21:32 PM'} IST
              </span>
            </div>

            {/* Bottom Right: Interactive Arrow Button — Hero color palette & slow transitions */}
            <div className="order-3 flex items-center justify-center md:justify-end">
              <button
                type="button"
                onClick={() => {
                  const lenis = (window as any).__lenis
                  if (lenis) {
                    lenis.scrollTo(0)
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                aria-label="Scroll to top"
                className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[0.84] active:scale-[0.76] shadow-sm hover:shadow-md bg-[#bfbfb2] hover:bg-[#b2b2a5] text-[#524d47]"
              >
                {/* First arrow: travels across full circle till top edge on hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                  <svg
                    className="w-8 h-8 sm:w-9 sm:h-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <polyline points="4 12 12 4 20 12" />
                  </svg>
                </div>

                {/* Second arrow: travels into center from bottom edge of circle on hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0">
                  <svg
                    className="w-8 h-8 sm:w-9 sm:h-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <polyline points="4 12 12 4 20 12" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.footer>
    </section>
  )
}
