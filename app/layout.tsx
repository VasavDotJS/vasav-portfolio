import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import 'lenis/dist/lenis.css'
import '@/styles/globals.css'
import { Dock } from '@/components/chrome/Dock'
import { MetaBar } from '@/components/chrome/MetaBar'
import { Grain } from '@/components/fx/Grain'
import { Providers } from '@/components/providers/Providers'
import { SceneMount } from '@/components/three/SceneMount'
import { headScript } from '@/lib/head-script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Vasav P Ramesh',
  description:
    'Vasav P Ramesh, third-year BCA (Hons) data science student in Kochi. Projects in Python, TypeScript and C.',
  openGraph: {
    title: 'Vasav P Ramesh',
    description: 'data science student in kochi. a café POS, a stock-return forecaster, and some C.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <head>
        <meta name="theme-color" content="#E8E5DF" />
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <a className="skip-link meta" href="#main">
          skip to content
        </a>
        <Providers>
          <MetaBar />
          <SceneMount />
          {children}
          <Dock />
        </Providers>
        <Grain />
      </body>
    </html>
  )
}
