import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ink: '#0a0a0a',
        'ink-soft': '#111111',
        'ink-border': '#1a1a1a',
        cream: '#e8e6e1',
        'cream-dark': '#d4d2cd',
        'text-primary': '#f1f0ed',
        'text-muted': '#6b6b6b',
        'text-dim': '#888888',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      transitionDuration: {
        '150': '150ms',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontSize: {
        'display': ['clamp(3.5rem, 10vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(2.5rem, 7vw, 7rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-xs': ['clamp(2rem, 5vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'section': '2.5rem',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
