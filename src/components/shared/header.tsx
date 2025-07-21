'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mic, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const { authState, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Mic className="h-6 w-6 text-primary" />
            <span className="font-bold">SmartSummarizer</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {authState.user && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{authState.user.name}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}