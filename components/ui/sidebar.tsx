'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProps {
  children: ReactNode
  className?: string
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isOpen } = useSidebar()

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform",
      !isOpen && "-translate-x-full",
      className
    )}>
      {children}
    </aside>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
