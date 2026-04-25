import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import MatrixAnimation from '@/components/matrix-animation'
import { TooltipProvider } from "@/components/ui/tooltip"
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://thesaurabh.me'),
  title: 'GitHub Matrix | Custom Contribution Pattern Generator',
  description: 'Create and deploy custom GitHub contribution patterns with our cyberpunk-themed GitHub Matrix tool. Design your contribution history, backdate commits, and draw on your graph.',
  keywords: ['GitHub', 'contribution graph', 'matrix', 'pattern generator', 'developer tools', 'github commits', 'commit generator', 'profile customization', 'github drawing', 'github commit history hack', 'fake github commits', 'github contribution graph maker', 'custom github profile', 'green dots generator', 'github backdate commits', 'github commit bot', 'github matrix profile', 'developer portfolio builder', 'thesupersaurabh'],
  authors: [{ name: 'Saurabh Kumar Thakur', url: 'https://thesaurabh.me' }],
  creator: 'Saurabh Kumar Thakur',
  openGraph: {
    title: 'GitHub Matrix | Custom Contribution Pattern Generator',
    description: 'Create and deploy custom GitHub contribution patterns with our cyberpunk-themed GitHub Matrix tool.',
    url: 'https://thesaurabh.me',
    siteName: 'GitHub Matrix',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitHub Matrix Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Matrix | Custom Contribution Pattern Generator',
    description: 'Create and deploy custom GitHub contribution patterns with our cyberpunk-themed GitHub Matrix tool.',
    creator: '@thesupersaurabh',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GitHub Matrix',
  description: 'Create and deploy custom GitHub contribution patterns with our cyberpunk-themed GitHub Matrix tool. Design your contribution history, backdate commits, and draw on your graph.',
  url: 'https://ghm.thesaurabh.me',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  author: {
    '@type': 'Person',
    name: 'Saurabh Kumar Thakur',
    url: 'https://thesaurabh.me'
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NQJ6B6FCM6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NQJ6B6FCM6');
          `}
        </Script>
      </head>
      <body className={cn(inter.className, 'min-h-screen bg-black')}>
        <MatrixAnimation />
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
        <Toaster />
        <div className="scanlines"></div>
        <div className="fixed top-0 left-0 w-full h-1 bg-green-500/20"></div>
        <div className="fixed bottom-0 left-0 w-full h-1 bg-green-500/20"></div>
        <div className="fixed top-0 left-0 h-full w-1 bg-green-500/20"></div>
        <div className="fixed top-0 right-0 h-full w-1 bg-green-500/20"></div>
      </body>
    </html>
  )
}
