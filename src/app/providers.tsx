'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/auth-context'

// This component's only job is to hold all your client-side providers.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}