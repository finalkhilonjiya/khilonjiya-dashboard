import { getUsers, getUserStats } from '@/lib/services/users'
import { UsersTable } from './users-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Users, Briefcase, UserCheck, CheckCircle } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    page?: string
    role?: string
    search?: string
    active?: string
  }>
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const filters = {
    role: params.role,
    search: params.search,
    isActive: params.active === 'true' ? true : params.active === 'false' ? false : undefined,
    page,
    limit: 10,
  }

  const [{ users, total }, stats] = await Promise.all([
    getUsers(filters),
    getUserStats(),
  ])

  const pageCount = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage all registered users on the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Total Users" value={stats.total} icon={Users} />
        <KPICard title="Job Seekers" value={stats.jobSeekers} icon={Users} />
        <KPICard title="Employers" value={stats.employers} icon={Briefcase} />
        <KPICard title="Active" value={stats.active} icon={UserCheck} />
        <KPICard title="Verified" value={stats.verified} icon={CheckCircle} />
      </div>

      {/* Table */}
      <UsersTable
        users={users}
        total={total}
        page={page}
        pageCount={pageCount}
        currentFilters={params}
      />
    </div>
  )
}
