import { getReports, getReportStats } from '@/lib/services/moderation'
import { ModerationTable } from './moderation-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Flag, Clock, Eye, CheckCircle } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    itemType?: string
  }>
}

export default async function ModerationPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const filters = {
    status: params.status,
    itemType: params.itemType,
    page,
    limit: 10,
  }

  const [{ reports, total }, stats] = await Promise.all([
    getReports(filters),
    getReportStats(),
  ])

  const pageCount = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moderation</h1>
        <p className="text-muted-foreground">
          Review and manage reported content and user reports.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard title="Total Reports" value={stats.total} icon={Flag} />
        <KPICard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          className={stats.pending > 0 ? 'border-amber-500/50' : ''}
        />
        <KPICard title="Reviewed" value={stats.reviewed} icon={Eye} />
        <KPICard title="Resolved" value={stats.resolved} icon={CheckCircle} />
      </div>

      {/* Table */}
      <ModerationTable
        reports={reports}
        total={total}
        page={page}
        pageCount={pageCount}
        currentFilters={params}
      />
    </div>
  )
}
