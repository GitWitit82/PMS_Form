'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Menu 
} from "lucide-react"
import { signOut } from "next-auth/react"

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isOpen, setIsOpen } = useSidebar()

  const isAdmin = session?.user?.role === "ADMIN"

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard"
    },
    // Only show User Management for admin users
    ...(isAdmin ? [{
      href: "/admin/users",
      label: "User Management",
      icon: Users,
      active: pathname === "/admin/users"
    }] : []),
    {
      href: "/projects",
      label: "Projects",
      icon: FileText,
      active: pathname === "/projects"
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings"
    }
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      <Sidebar>
        <div className="flex flex-col h-full">
          <div className="space-y-4 py-4 flex-1">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">
                Project Manager
              </h2>
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                      link.active && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t p-4 space-y-4">
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
