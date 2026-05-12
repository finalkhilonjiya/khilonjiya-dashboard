import { getConstructionRequests, getConstructionStats, getServiceTypes } from '@/lib/services/construction'
import { ConstructionTable } from './construction-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { HardHat, Clock, Hammer, CheckCircle, IndianRupee } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    serviceType?: string
    search?: string
  }>
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function ConstructionPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const filters = {
    status: params.status,
    serviceType: params.serviceType,
    search: params.search,
    page,
    limit: 10,
  }

  const [{ requests, total }, stats, serviceTypes] = await Promise.all([
    getConstructionRequests(filters),
    getConstructionStats(),
    getServiceTypes(),
  ])

  const pageCount = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Construction Services</h1>
        <p className="text-muted-foreground">
          Manage construction service requests and quotes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Total Requests" value={stats.total} icon={HardHat} />
        <KPICard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          className={stats.pending > 0 ? 'border-amber-500/50' : ''}
        />
        <KPICard title="In Progress" value={stats.inProgress} icon={Hammer} />
        <KPICard title="Completed" value={stats.completed} icon={CheckCircle} />
        <KPICard
          title="Total Quote Value"
          value={formatCurrency(stats.totalQuoteValue)}
          icon={IndianRupee}
        />
      </div>

      {/* Table */}
      <ConstructionTable
        requests={requests}
        total={total}
        page={page}
        pageCount={pageCount}
        serviceTypes={serviceTypes}
        currentFilters={params}
      />
    </div>
  )
}
