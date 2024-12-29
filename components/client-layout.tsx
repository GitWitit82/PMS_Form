/**
 * ClientLayout: Application shell component
 * Handles sidebar, header, and main content layout
 */
'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { AppSidebar } from './app-sidebar'
import { useWorkspace } from '@/providers/workspace-provider'
import { cn } from '@/lib/utils'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { state: { sidebarOpen } } = useWorkspace()

  // Handle authentication
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <AppSidebar />
        <main
          className={cn(
            'flex-1 transition-all duration-300 ease-in-out',
            sidebarOpen ? 'pl-64' : 'pl-16'
          )}
        >
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 