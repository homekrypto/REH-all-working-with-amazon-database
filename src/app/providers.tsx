'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from '@/contexts/user-context'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}

