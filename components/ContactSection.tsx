'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
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
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" ref={ref} style={{ background: '#F1F1F1' }}>
      {/* Dark rounded contact card — matches reference exactly */}
      <div
        className="mx-3 md:mx-6 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #181818 0%, #0d0d0d 50%, #141414 100%)',
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
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-center font-medium mb-8" style={{ color: '#f1f0ed', letterSpacing: '-0.01em' }}>
                Have a project in mind?
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name input — rounded, like reference */}
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono outline-none t-150"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f0ed',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono outline-none t-150"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f0ed',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <textarea
                  placeholder="Tell me about your business or project"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono outline-none t-150 resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f1f0ed',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />

                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full py-4 rounded-xl font-bold text-sm tracking-wide t-150"
                  style={{
                    background: status === 'sent' ? '#22c55e' : '#f1f0ed',
                    color: '#0d0d0d',
                  }}
                >
                  {status === 'idle' && 'Get a quote'}
                  {status === 'sending' && 'Sending...'}
                  {status === 'sent' && '✓ Message sent!'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer — cream background, two-column links — matches reference */}
      <motion.footer
        custom={0.4}
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="section-pad"
        style={{ paddingTop: 'clamp(3rem, 6vh, 5rem)', paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}
      >
        <div className="content-width">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-lg">
            <div>
              <h4
                className="font-bold text-sm mb-4 pb-3"
                style={{ color: '#1B1B1B', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
              >
                Menu
              </h4>
              <ul className="space-y-2.5">
                {menuLinks.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={e => {
                        e.preventDefault()
                        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-sm t-150"
                      style={{ color: '#6b6b6b' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1B1B1B')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="font-bold text-sm mb-4 pb-3"
                style={{ color: '#1B1B1B', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
              >
                Socials
              </h4>
              <ul className="space-y-2.5">
                {socialLinks.map(s => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm t-150"
                      style={{ color: '#6b6b6b' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1B1B1B')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-12 text-xs font-mono" style={{ color: 'rgba(0,0,0,0.3)' }}>
            © 2026 Jitendra Kushwah. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </section>
  )
}
