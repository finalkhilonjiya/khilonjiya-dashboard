import type { Metadata, Viewport } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Khilonjiya Dashboard',
    template: '%s | Khilonjiya Dashboard',
  },

  description:
    'Admin dashboard for Khilonjiya platform management and analytics.',

  applicationName: 'Khilonjiya Dashboard',

  generator: 'Next.js',

  keywords: [
    'Khilonjiya',
    'Dashboard',
    'Admin',
    'Supabase',
    'Analytics',
    'Jobs',
    'Construction',
  ],

  authors: [
    {
      name: 'Khilonjiya',
    },
  ],

  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],

    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >

      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          font-sans
          antialiased
        `}
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          {children}

        </ThemeProvider>

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}

      </body>

    </html>
  )
}