'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { socials } from '@/lib/data'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

const WORD_DURATION = 0.85
const WORD_STAGGER = 0.28

const wordBlock = {
  hidden: {
    y: '120%',
  },
  visible: (i: number = 0) => ({
    y: '0%',
    transition: {
      delay: i * WORD_STAGGER,
      duration: WORD_DURATION,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

const menuLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Expertise', href: '#services' },
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: socials.linkedin },
  { label: 'Github', href: socials.github },
  { label: 'LeetCode', href: socials.leetcode },
  { label: 'Codeforces', href: socials.codeforces },
  { label: 'CodeChef', href: socials.codechef },
]

export default function ContactSection() {
  const headingRef = useRef(null)
  const isHeadingInView = useInView(headingRef, {
    once: true,
    amount: 0.35,
    margin: '0px 0px -80px 0px',
  })
  const footerRef = useRef(null)
  const isFooterInView = useInView(footerRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -40px 0px',
  })
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

    const subject = encodeURIComponent(`Portfolio Inquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:jeetu.singh4824@gmail.com?subject=${subject}&body=${body}`

    await new Promise((r) => setTimeout(r, 600))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section
      id="contact"
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
          background: 'linear-gradient(180deg, #080807 0%, #393632 100%)',
          paddingLeft: 'clamp(1rem, 3vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 3vw, 2.5rem)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
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
            ref={headingRef}
            initial="hidden"
            animate={isHeadingInView ? 'visible' : 'hidden'}
            className="uppercase text-center select-none"
            style={{
              fontSize: 'clamp(2.8rem, 10vw, 144px)',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: 'rgb(209, 209, 199)',
              lineHeight: '0.88',
            }}
          >
            <span className="block overflow-hidden pt-1 pb-2">
              <motion.span
                custom={0}
                variants={wordBlock}
                className="inline-block mr-[0.25em]"
              >
                LET&apos;S
              </motion.span>
              <motion.span
                custom={1}
                variants={wordBlock}
                className="inline-block"
              >
                MAKE
              </motion.span>
            </span>
            <span className="block overflow-hidden pt-1 pb-2">
              <motion.span
                custom={2}
                variants={wordBlock}
                className="inline-block mr-[0.25em]"
              >
                IT
              </motion.span>
              <motion.span
                custom={3}
                variants={wordBlock}
                className="inline-block"
              >
                HAPPEN
              </motion.span>
            </span>
          </motion.h2>

          {/* Form card — preloaded without animation */}
          <div className="mt-14 max-w-md mx-auto">
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 2px 8px rgba(8,8,7,0.15), 0 6px 20px rgba(8,8,7,0.12), 0 16px 48px rgba(8,8,7,0.1), 0 32px 80px rgba(8,8,7,0.08)',
              }}
            >
              <p
                className="text-center mb-8"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 32px)',
                  fontWeight: 500,
                  color: 'rgb(232, 232, 227)',
                  letterSpacing: '-0.01em',
                }}
              >
                Wanna hire me?
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name input */}
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-5 py-3 rounded-xl outline-none t-150 contact-input"
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: '25px',
                    fontWeight: 400,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
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
                  className="w-full px-5 py-3 rounded-xl outline-none t-150 contact-input"
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: '25px',
                    fontWeight: 400,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f1f0ed',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <textarea
                  placeholder="Your message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-5 py-3 rounded-xl outline-none t-150 resize-none contact-input"
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: '25px',
                    fontWeight: 400,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f1f0ed',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />

                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full py-4 rounded-xl font-mono uppercase cursor-pointer select-none transition-colors duration-300 hover:!bg-white"
                  style={{
                    background: '#e8e8e3',
                    color: 'rgb(0, 0, 0)',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#e8e8e3')}
                >
                  <span
                    className="flex items-center justify-center tracking-wider"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    {status === 'idle' ? (
                      <span>Submit</span>
                    ) : status === 'sending' ? (
                      'Sending...'
                    ) : (
                      '✓ Message sent!'
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — 3-column links with generous vertical space */}
      <motion.footer
        ref={footerRef}
        custom={0.2}
        variants={fadeUp}
        initial="hidden"
        animate={isFooterInView ? 'visible' : 'hidden'}
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
                className="mb-4 pb-3"
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'rgb(57, 54, 50)',
                  borderBottom: '1px solid rgba(20, 20, 20, 0.15)',
                }}
              >
                Menu
              </h4>
              <ul className="space-y-0.5 max-w-[250px]">
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
                      className="group relative inline-block"
                      style={{
                        fontSize: '20px',
                        fontWeight: 400,
                        color: 'rgb(107, 100, 92)',
                        lineHeight: 1.25,
                      }}
                    >
                      <span className="relative block overflow-hidden leading-tight">
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
                className="mb-4 pb-3"
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'rgb(57, 54, 50)',
                  borderBottom: '1px solid rgba(20, 20, 20, 0.15)',
                }}
              >
                Socials
              </h4>
              <ul className="space-y-0.5">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={s.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                      className="group relative inline-block"
                      style={{
                        fontSize: '20px',
                        fontWeight: 400,
                        color: 'rgb(107, 100, 92)',
                        lineHeight: 1.25,
                      }}
                    >
                      <span className="relative block overflow-hidden leading-tight">
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
            <div className="flex flex-col items-center justify-center gap-1 text-center order-1 md:order-2">
              <span
                className="uppercase tracking-wider"
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'rgb(57, 54, 50)',
                }}
              >
                LOCAL TIME
              </span>
              <span
                style={{
                  fontFamily: 'Consolas, monospace',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'rgb(107, 100, 92)',
                }}
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
