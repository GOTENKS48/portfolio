import type { Metadata } from 'next'
import 'lenis/dist/lenis.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jitendra Portfolio',
  description:
    'Portfolio of Jitendra — a software engineer specializing in scalable web applications, real-time systems, and precision UI/UX.',
  keywords: [
    'Full-Stack Developer',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'UI Engineer',
    'Software Engineer India',
    'Portfolio',
  ],
  authors: [{ name: 'Jitendra' }],
  openGraph: {
    title: 'Jitendra Portfolio',
    description: 'Software engineer building fast, scalable, and beautiful web products.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                var sy = parseInt(sessionStorage.getItem('portfolio_scroll_y') || '0', 10);
                if (sy > 50) {
                  document.documentElement.classList.add('is-restoring-scroll');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var sy = parseInt(sessionStorage.getItem('portfolio_scroll_y') || '0', 10);
                if (sy > 0) {
                  window.scrollTo(0, sy);
                }
              } catch(e) {}
            `,
          }}
        />
      </body>
    </html>
  )
}
