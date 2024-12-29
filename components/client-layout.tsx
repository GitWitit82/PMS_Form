'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen pt-16 px-4 md:px-6 transition-all duration-300">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
} 