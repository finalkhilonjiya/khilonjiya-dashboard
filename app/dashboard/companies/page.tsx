import { getCompanies, getCompanyStats, getIndustries } from '@/lib/services/companies'
import { CompaniesTable } from './companies-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Building2, CheckCircle, XCircle } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    industry?: string
    verified?: string
  }>
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const filters = {
    search: params.search,
    industry: params.industry,
    isVerified: params.verified === 'true' ? true : params.verified === 'false' ? false : undefined,
    page,
    limit: 10,
  }

  const [{ companies, total }, stats, industries] = await Promise.all([
    getCompanies(filters),
    getCompanyStats(),
    getIndustries(),
  ])

  const pageCount = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground">
          Manage registered companies and verification status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Total Companies"
          value={stats.total}
          icon={Building2}
        />
        <KPICard
          title="Verified"
          value={stats.verified}
          icon={CheckCircle}
        />
        <KPICard
          title="Pending Verification"
          value={stats.unverified}
          icon={XCircle}
          className={stats.unverified > 0 ? 'border-amber-500/50' : ''}
        />
      </div>

      {/* Table */}
      <CompaniesTable
        companies={companies}
        total={total}
        page={page}
        pageCount={pageCount}
        industries={industries as string[]}
        currentFilters={params}
      />
    </div>
  )
}
