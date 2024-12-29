/**
 * AppSidebar: Main application sidebar component
 * Provides navigation and user controls
 */
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ChevronLeft,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  FileText,
  Workflow,
  Menu,
  Building2,
  Contact2,
  Network,
  ClipboardList,
  Building,
  UserCircle,
  Activity,
  History,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/providers/workspace-provider'
import { ThemeToggle } from './theme-toggle'
import { UserRole } from '@prisma/client'

const navigation = [
  // Dashboard & Overview
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.PROJECT_MGT, UserRole.CEO],
  },
  {
    name: 'Activity Log',
    href: '/activity',
    icon: Activity,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT, UserRole.CEO],
  },

  // Project Management
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.PROJECT_MGT, UserRole.CEO],
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: ClipboardList,
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.PROJECT_MGT, UserRole.CEO],
  },

  // Workflow System
  {
    name: 'Workflows',
    href: '/workflows',
    icon: Workflow,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT, UserRole.CEO],
  },
  {
    name: 'Workflow Templates',
    href: '/workflows/templates',
    icon: Network,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT],
  },
  {
    name: 'Workflow History',
    href: '/workflows/history',
    icon: History,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT, UserRole.CEO],
  },

  // Customer & Contact Management
  {
    name: 'Customers',
    href: '/customers',
    icon: Building2,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT, UserRole.CEO],
  },
  {
    name: 'Contacts',
    href: '/contacts',
    icon: Contact2,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT, UserRole.STAFF],
  },

  // Resource Management
  {
    name: 'Departments',
    href: '/departments',
    icon: Building,
    roles: [UserRole.ADMIN, UserRole.CEO],
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: UserCircle,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT, UserRole.CEO],
  },

  // Forms & Documentation
  {
    name: 'Forms',
    href: '/forms',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.PROJECT_MGT],
  },

  // Administration
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [UserRole.ADMIN, UserRole.CEO],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { state: { sidebarOpen }, toggleSidebar } = useWorkspace()

  const userRole = session?.user?.role as UserRole

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  )

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen && (
          <Link href="/dashboard" className="text-xl font-bold">
            EPM
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                !sidebarOpen && 'justify-center'
              )}
            >
              <Icon className={cn('h-5 w-5', sidebarOpen && 'mr-3')} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{session?.user?.username}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.role}</p>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
