import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jitendra Kumar — Full-Stack Developer & UI Engineer',
  description:
    'Portfolio of Jitendra Kumar — a full-stack engineer specializing in scalable web applications, real-time data pipelines, and precision UI/UX. Available for freelance and full-time opportunities.',
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
  authors: [{ name: 'Jitendra Kumar' }],
  openGraph: {
    title: 'Jitendra Kumar — Full-Stack Developer',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
