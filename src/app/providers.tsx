// src/app/providers.tsx (Example of a likely file)

'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/auth-context' // Assuming you have this
import { type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    // The ThemeProvider is a very common source of hydration errors.
    // Using `attribute="class"` and `enableSystem` is the standard setup.
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}