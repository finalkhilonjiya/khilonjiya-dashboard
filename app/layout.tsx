import type { Metadata } from 'next'

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import './globals.css'

export const metadata: Metadata = {
  title: 'Khilonjiya Dashboard',
  description: 'Khilonjiya Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body
        className={`
          ${GeistSans.variable}
          ${GeistMono.variable}
          min-h-screen bg-background font-sans antialiased
        `}
      >

        {children}

      </body>

    </html>
  )
}