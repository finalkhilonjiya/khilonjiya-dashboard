'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  FileText,
  HardHat,
  CreditCard,
  Flag,
  Bell,
  MapPin,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Search,
  Menu,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
  { name: 'Companies', href: '/dashboard/companies', icon: Building2 },
  { name: 'Applications', href: '/dashboard/applications', icon: FileText },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Construction', href: '/dashboard/construction', icon: HardHat },
  { name: 'Revenue', href: '/dashboard/revenue', icon: CreditCard },
  { name: 'Moderation', href: '/dashboard/moderation', icon: Flag },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Districts', href: '/dashboard/districts', icon: MapPin },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Search Trends', href: '/dashboard/search-trends', icon: Search },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function SidebarContent({
  isCollapsed,
  pathname,
  onLogout,
}: {
  isCollapsed: boolean
  pathname: string
  onLogout: () => Promise<void>
}) {
  return (
    <>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">

        {!isCollapsed && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 overflow-hidden"
          >

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>

            </div>

            <span className="truncate font-semibold text-sidebar-foreground">
              Khilonjiya
            </span>

          </Link>
        )}

      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">

        <nav className="flex flex-col gap-1">

          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (
                item.href !== '/dashboard' &&
                pathname.startsWith(item.href)
              )

            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
              >

                <item.icon className="h-4 w-4 shrink-0" />

                {!isCollapsed && (
                  <span className="truncate">
                    {item.name}
                  </span>
                )}

              </Link>
            )
          })}

        </nav>

      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-2">

        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive',
            isCollapsed && 'justify-center px-2'
          )}
          onClick={onLogout}
        >

          <LogOut className="h-4 w-4 shrink-0" />

          {!isCollapsed && (
            <span>Logout</span>
          )}

        </Button>

      </div>
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')

    if (stored === 'true') {
      setIsCollapsed(true)
    }
  }, [])

  const toggleSidebar = () => {
    const next = !isCollapsed

    setIsCollapsed(next)

    localStorage.setItem(
      'sidebar-collapsed',
      String(next)
    )
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()

      await supabase.auth.signOut()

      router.push('/login')
      router.refresh()

    } catch (error) {
      console.error('Logout Error:', error)
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="flex h-14 items-center border-b px-4 md:hidden">

        <Sheet>

          <SheetTrigger asChild>

            <Button
              variant="ghost"
              size="icon"
            >
              <Menu className="h-5 w-5" />
            </Button>

          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[280px] p-0"
          >

            <div className="flex h-full flex-col bg-sidebar">

              <SidebarContent
                isCollapsed={false}
                pathname={pathname}
                onLogout={handleLogout}
              />

            </div>

          </SheetContent>

        </Sheet>

        <div className="ml-3 truncate font-semibold">
          Khilonjiya Dashboard
        </div>

      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden border-r bg-sidebar transition-all duration-300 md:flex md:flex-col',
          isCollapsed ? 'md:w-16' : 'md:w-64'
        )}
      >

        <div className="flex h-full flex-col overflow-hidden">

          <SidebarContent
            isCollapsed={isCollapsed}
            pathname={pathname}
            onLogout={handleLogout}
          />

          <div className="border-t p-2">

            <Button
              variant="ghost"
              size="icon"
              className="ml-auto flex"
              onClick={toggleSidebar}
            >

              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}

            </Button>

          </div>

        </div>

      </aside>
    </>
  )
}