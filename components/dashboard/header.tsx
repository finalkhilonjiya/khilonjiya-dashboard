'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

import {
  Bell,
  Search,
  User,
  Moon,
  Sun,
  LogOut,
  Settings,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

interface HeaderProps {
  user: {
    email?: string
    profile?: {
      full_name?: string | null
      avatar_url?: string | null
    }
  } | null
}

export function Header({
  user,
}: HeaderProps) {

  const router = useRouter()

  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const userInitials = useMemo(() => {
    const name = user?.profile?.full_name

    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    }

    return (
      user?.email
        ?.substring(0, 2)
        .toUpperCase() || 'AD'
    )
  }, [user])

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">

      {/* Search */}
      <div className="relative hidden w-full max-w-md md:block">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="search"
          placeholder="Search jobs, companies, users..."
          className="pl-10"
        />

      </div>

      {/* Mobile Spacer */}
      <div className="md:hidden" />

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(
                theme === 'dark'
                  ? 'light'
                  : 'dark'
              )
            }
          >

            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}

          </Button>
        )}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >

          <Bell className="h-4 w-4" />

          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
            3
          </span>

        </Button>

        {/* User Dropdown */}
        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
            >

              <Avatar className="h-9 w-9">

                <AvatarImage
                  src={user?.profile?.avatar_url || ''}
                  alt="Avatar"
                />

                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>

              </Avatar>

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56"
            align="end"
            forceMount
          >

            <DropdownMenuLabel className="font-normal">

              <div className="flex flex-col space-y-1">

                <p className="text-sm font-medium leading-none">
                  {user?.profile?.full_name || 'Admin'}
                </p>

                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>

              </div>

            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>

              <Link href="/dashboard/settings">

                <Settings className="mr-2 h-4 w-4" />

                Settings

              </Link>

            </DropdownMenuItem>

            <DropdownMenuItem asChild>

              <Link href="/dashboard/profile">

                <User className="mr-2 h-4 w-4" />

                Profile

              </Link>

            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >

              <LogOut className="mr-2 h-4 w-4" />

              Logout

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>
  )
}