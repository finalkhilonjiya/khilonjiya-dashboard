import { getApplications, getApplicationStats } from '@/lib/services/applications'
import { ApplicationsTable } from './applications-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { FileText, Eye, ListChecks, CalendarCheck, CheckCircle, XCircle } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    search?: string
  }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const filters = {
    status: params.status,
    search: params.search,
    page,
    limit: 10,
  }

  const [{ applications, total }, stats] = await Promise.all([
    getApplications(filters),
    getApplicationStats(),
  ])

  const pageCount = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Track and manage all job applications on the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <KPICard title="Total" value={stats.total} icon={FileText} />
        <KPICard title="Applied" value={stats.applied} icon={FileText} />
        <KPICard title="Viewed" value={stats.viewed} icon={Eye} />
        <KPICard title="Shortlisted" value={stats.shortlisted} icon={ListChecks} />
        <KPICard title="Interviewed" value={stats.interviewed} icon={CalendarCheck} />
        <KPICard title="Selected" value={stats.selected} icon={CheckCircle} />
        <KPICard title="Rejected" value={stats.rejected} icon={XCircle} />
      </div>

      {/* Table */}
      <ApplicationsTable
        applications={applications}
        total={total}
        page={page}
        pageCount={pageCount}
        currentFilters={params}
      />
    </div>
  )
}
