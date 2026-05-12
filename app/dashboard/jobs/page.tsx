import { getJobs, getJobStats, getJobCategories, getDistricts } from '@/lib/services/jobs'
import { JobsTable } from './jobs-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Briefcase, CheckCircle, Clock, XCircle, Star, AlertTriangle } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    search?: string
    district?: string
    category?: string
  }>
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const filters = {
    status: params.status,
    search: params.search,
    district: params.district,
    category: params.category,
    page,
    limit: 10,
  }

  const [{ jobs, total }, stats, categories, districts] = await Promise.all([
    getJobs(filters),
    getJobStats(),
    getJobCategories(),
    getDistricts(),
  ])

  const pageCount = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Listings</h1>
        <p className="text-muted-foreground">
          Manage and monitor all job listings on the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <KPICard
          title="Total Jobs"
          value={stats.total}
          icon={Briefcase}
        />
        <KPICard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
        />
        <KPICard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          className={stats.pending > 0 ? 'border-amber-500/50' : ''}
        />
        <KPICard
          title="Closed"
          value={stats.closed}
          icon={XCircle}
        />
        <KPICard
          title="Premium"
          value={stats.premium}
          icon={Star}
        />
        <KPICard
          title="Urgent"
          value={stats.urgent}
          icon={AlertTriangle}
        />
      </div>

      {/* Table */}
      <JobsTable
        jobs={jobs}
        total={total}
        page={page}
        pageCount={pageCount}
        categories={categories}
        districts={districts}
        currentFilters={params}
      />
    </div>
  )
}
