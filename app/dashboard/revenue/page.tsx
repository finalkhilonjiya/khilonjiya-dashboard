import {
  getRevenueStats,
  getTransactions,
  getMonthlyRevenueTrend,
} from '@/lib/services/revenue'

import { KPICard } from '@/components/dashboard/kpi-card'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

import {
  IndianRupee,
  TrendingUp,
  Users,
  CreditCard,
} from 'lucide-react'

import { format } from 'date-fns'

import RevenueChart from './revenue-chart'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function RevenuePage({
  searchParams,
}: PageProps) {

  const params = await searchParams

  const page = parseInt(
    params.page || '1'
  )

  const [
    stats,
    { transactions },
    revenueTrend,
  ] = await Promise.all([
    getRevenueStats(),
    getTransactions(page, 10),
    getMonthlyRevenueTrend(6),
  ])

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Revenue & Payments
        </h1>

        <p className="text-muted-foreground">
          Complete subscription and revenue analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <KPICard
          title="Revenue MTD"
          value={formatCurrency(
            stats.revenueMTD
          )}
          description="Current month revenue"
          icon={IndianRupee}
        />

        <KPICard
          title="Last Month"
          value={formatCurrency(
            stats.revenueLastMonth
          )}
          description="Previous month"
          icon={TrendingUp}
        />

        <KPICard
          title="Active Subscribers"
          value={
            stats.activeSubscriptions
          }
          description="Currently active"
          icon={Users}
        />

        <KPICard
          title="Total Transactions"
          value={
            stats.totalTransactions
          }
          description="All subscription purchases"
          icon={CreditCard}
        />

      </div>

      <RevenueChart
        revenueTrend={revenueTrend}
      />

      <Card>

        <CardHeader>
          <CardTitle>
            Recent Subscription Payments
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            {transactions.map((tx: any) => {

              const profile =
                tx.user_profiles

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >

                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">

                      {profile?.avatar_url ? (
                        <img
                          src={
                            profile.avatar_url
                          }
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                          {profile?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || 'U'}
                        </div>
                      )}

                    </div>

                    <div className="space-y-1">

                      <p className="font-semibold">
                        {profile?.full_name ||
                          'Unknown User'}
                      </p>

                      {profile?.email && (
                        <p className="text-xs text-muted-foreground">
                          {profile.email}
                        </p>
                      )}

                      {profile?.mobile_number && (
                        <p className="text-xs text-muted-foreground">
                          {profile.mobile_number}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Plan: {tx.plan_name}
                      </p>

                    </div>

                  </div>

                  <div className="text-right space-y-2">

                    <p className="text-lg font-bold">
                      {formatCurrency(
                        tx.amount_rupees
                      )}
                    </p>

                    <Badge>
                      {tx.status}
                    </Badge>

                  </div>

                </div>
              )
            })}

          </div>

        </CardContent>

      </Card>

    </div>
  )
}