import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  FileText,
  CreditCard,
  Clock,
  Flag,
  HardHat,
  Activity,
} from 'lucide-react'

import { KPICard } from '@/components/dashboard/kpi-card'

import {
  TrendAreaChart,
  TrendLineChart,
  DonutChart,
  HorizontalBarChart,
} from '@/components/dashboard/charts'

import {
  getDashboardStats,
  getUserRegistrationTrend,
  getJobPostingTrend,
  getApplicationsTrend,
  getRevenueTrend,
  getJobsByCategory,
  getTopDistricts,
  getRecentJobs,
} from '@/lib/services/dashboard'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

export const revalidate = 120

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }

  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }

  return num.toString()
}

export default async function DashboardPage() {
  try {
    const [
      stats,
      userTrend,
      jobTrend,
      applicationTrend,
      revenueTrend,
      jobsByCategory,
      topDistricts,
      recentJobs,
    ] = await Promise.all([
      getDashboardStats(),
      getUserRegistrationTrend(30),
      getJobPostingTrend(30),
      getApplicationsTrend(30),
      getRevenueTrend(30),
      getJobsByCategory(),
      getTopDistricts(),
      getRecentJobs(5),
    ])

    return (
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Welcome back. Here&apos;s an overview of your platform.
          </p>
        </div>

        {/* KPI ROW 1 */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          <KPICard
            title="Total Users"
            value={formatNumber(stats.totalUsers)}
            description="Registered users"
            icon={Users}
          />

          <KPICard
            title="Active Users"
            value={formatNumber(stats.activeUsers)}
            description="Last 7 days"
            icon={UserCheck}
          />

          <KPICard
            title="Companies"
            value={formatNumber(stats.totalCompanies)}
            description="Registered companies"
            icon={Building2}
          />

          <KPICard
            title="Active Jobs"
            value={formatNumber(stats.activeJobs)}
            description="Currently live"
            icon={Briefcase}
          />

          <KPICard
            title="Applications Today"
            value={formatNumber(stats.applicationsToday)}
            description="New applications"
            icon={FileText}
          />

        </div>

        {/* KPI ROW 2 */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          <KPICard
            title="Revenue MTD"
            value={formatCurrency(stats.revenueMTD)}
            description="Month to date"
            icon={CreditCard}
          />

          <KPICard
            title="Active Subscriptions"
            value={formatNumber(stats.activeSubscriptions)}
            description="Paying users"
            icon={Activity}
          />

          <KPICard
            title="Employers"
            value={formatNumber(stats.totalEmployers)}
            description="Registered employers"
            icon={Clock}
          />

          <KPICard
            title="Pending Reports"
            value={formatNumber(stats.pendingReports)}
            description="Needs review"
            icon={Flag}
            className={
              stats.pendingReports > 0
                ? 'border-amber-500/50'
                : ''
            }
          />

          <KPICard
            title="Construction Requests"
            value={formatNumber(stats.pendingConstructionRequests)}
            description="Pending requests"
            icon={HardHat}
          />

        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 lg:grid-cols-2">

          <TrendAreaChart
            title="User Registrations"
            description="New users over the last 30 days"
            data={userTrend}
            dataKey="users"
            color="hsl(var(--chart-1))"
          />

          <TrendLineChart
            title="Job Postings"
            description="Jobs posted over the last 30 days"
            data={jobTrend}
            dataKey="jobs"
            color="hsl(var(--chart-2))"
          />

        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 lg:grid-cols-2">

          <TrendAreaChart
            title="Applications"
            description="Applications over the last 30 days"
            data={applicationTrend}
            dataKey="applications"
            color="hsl(var(--chart-3))"
          />

          <TrendLineChart
            title="Revenue"
            description="Revenue over the last 30 days"
            data={revenueTrend}
            dataKey="revenue"
            color="hsl(var(--chart-4))"
          />

        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-4 lg:grid-cols-2">

          <DonutChart
            title="Jobs by Category"
            description="Distribution of active jobs"
            data={jobsByCategory}
          />

          <HorizontalBarChart
            title="Top Districts"
            description="Districts with highest job listings"
            data={topDistricts}
            dataKey="jobs"
          />

        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Recent Jobs */}
          <Card>

            <CardHeader>
              <CardTitle className="text-base">
                Recent Jobs
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >

                    <div className="space-y-1">

                      <p className="text-sm font-medium leading-none">
                        {job.job_title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {(job.companies as { name: string })?.name || 'Unknown Company'}
                      </p>

                    </div>

                    <div className="flex items-center gap-2">

                      <Badge
                        variant={
                          job.status === 'active'
                            ? 'default'
                            : job.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {job.status}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {job.applications_count} apps
                      </span>

                    </div>

                  </div>
                ))}

                {recentJobs.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No recent jobs found
                  </p>
                )}

              </div>

            </CardContent>

          </Card>

          {/* Platform Overview */}
          <Card>

            <CardHeader>
              <CardTitle className="text-base">
                Platform Overview
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Employers
                  </span>

                  <span className="font-medium">
                    {formatNumber(stats.totalEmployers)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Companies
                  </span>

                  <span className="font-medium">
                    {formatNumber(stats.totalCompanies)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Job Listings
                  </span>

                  <span className="font-medium">
                    {formatNumber(stats.activeJobs)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Applications Today
                  </span>

                  <span className="font-medium">
                    {formatNumber(stats.applicationsToday)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Subscriptions
                  </span>

                  <span className="font-medium">
                    {formatNumber(stats.activeSubscriptions)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Pending Reports
                  </span>

                  <span className="font-medium text-amber-600">
                    {formatNumber(stats.pendingReports)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Construction Requests
                  </span>

                  <span className="font-medium">
                    {formatNumber(stats.pendingConstructionRequests)}
                  </span>
                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>
    )

  } catch (error) {
    console.error('Dashboard Error:', error)

    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <Card className="w-full max-w-md border-destructive/30">

          <CardHeader>
            <CardTitle className="text-destructive">
              Dashboard Error
            </CardTitle>
          </CardHeader>

          <CardContent>

            <p className="text-sm text-muted-foreground">
              Failed to load dashboard analytics.
              Please refresh the page or try again later.
            </p>

          </CardContent>

        </Card>

      </div>
    )
  }
}