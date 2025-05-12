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
  title: 'GitHub Matrix | Custom Contribution Pattern Generator',
  description: 'Create custom GitHub contribution patterns with our cyberpunk-themed GitHub Matrix tool. Design your contribution history with ease.',
  keywords: 'GitHub, contribution graph, matrix, pattern generator, developer tools',
  openGraph: {
    title: 'GitHub Matrix | Custom Contribution Pattern Generator',
    description: 'Create custom GitHub contribution patterns with our cyberpunk-themed GitHub Matrix tool.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
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
