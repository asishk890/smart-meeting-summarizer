// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from './providers'
import { ClientOnly } from '@/components/ui/client-only' // Import the wrapper
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  //... your metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <ClientOnly>
            <Toaster position="top-center" richColors />
          </ClientOnly>
        </Providers>
      </body>
    </html>
  )
}