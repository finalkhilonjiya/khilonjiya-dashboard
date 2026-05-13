import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Khilonjiya Dashboard',
  description: 'Admin Dashboard',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className="min-h-screen w-full overflow-x-hidden bg-background text-foreground antialiased">

        <div className="min-h-screen w-full overflow-x-hidden">
          {children}
        </div>

      </body>

    </html>
  )
}