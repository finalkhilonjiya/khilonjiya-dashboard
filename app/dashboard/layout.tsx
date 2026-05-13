import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Verify admin role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  if (
    profileError ||
    !profile ||
    !['admin', 'super_admin'].includes(profile.role)
  ) {
    redirect('/unauthorized')
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">

      <Sidebar />

      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">

        <Header
          user={{
            ...user,
            profile,
          }}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="w-full px-4 py-4 md:px-6">
            {children}
          </div>
        </main>

      </div>

    </div>
  )
}