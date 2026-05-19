// app/dashboard/revenue/page.tsx

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
  }).format(Number(amount || 0))
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
          trend={
            stats.growthPercent !== 0
              ? {
                  value: Math.round(
                    stats.growthPercent
                  ),
                  isPositive:
                    stats.growthPercent > 0,
                }
              : undefined
          }
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

            {transactions.map((tx) => {

              const profile =
                Array.isArray(
                  tx.user_profiles
                )
                  ? tx.user_profiles[0]
                  : tx.user_profiles

              return (
                <div
                  key={tx.id}
                  className="flex flex-col gap-4 border-b pb-4 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex items-start gap-4 min-w-0">

                    <div className="h-12 w-12 overflow-hidden rounded-full bg-muted flex-shrink-0">

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

                    <div className="space-y-1 min-w-0">

                      <p className="font-semibold truncate">
                        {profile?.full_name ||
                          'Unknown User'}
                      </p>

                      {profile?.email && (
                        <p className="text-xs text-muted-foreground break-all">
                          {profile.email}
                        </p>
                      )}

                      {profile?.mobile_number && (
                        <p className="text-xs text-muted-foreground">
                          {profile.mobile_number}
                        </p>
                      )}

                      {(profile?.current_city ||
                        profile?.current_state) && (
                        <p className="text-xs text-muted-foreground">
                          {profile?.current_city || ''}
                          {profile?.current_city &&
                          profile?.current_state
                            ? ', '
                            : ''}
                          {profile?.current_state || ''}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Plan:{' '}
                        {tx.plan_name || 'N/A'}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Platform:{' '}
                        {tx.platform || 'N/A'}
                      </p>

                      <p className="text-xs text-muted-foreground">

                        Purchased:{' '}

                        {tx.created_at
                          ? format(
                              new Date(
                                tx.created_at
                              ),
                              'PPpp'
                            )
                          : 'N/A'}

                      </p>

                    </div>

                  </div>

                  <div className="text-left md:text-right space-y-2">

                    <p className="text-lg font-bold">

                      {formatCurrency(
                        Number(
                          tx.amount_rupees || 0
                        )
                      )}

                    </p>

                    <Badge
                      variant={
                        tx.status === 'active'
                          ? 'default'
                          : tx.status === 'pending'
                            ? 'secondary'
                            : tx.status === 'expired'
                              ? 'outline'
                              : 'destructive'
                      }
                    >
                      {tx.status || 'unknown'}
                    </Badge>

                    {tx.razorpay_payment_id && (
                      <p className="text-xs text-muted-foreground break-all">
                        {tx.razorpay_payment_id}
                      </p>
                    )}

                  </div>

                </div>
              )
            })}

            {transactions.length === 0 && (

              <p className="py-8 text-center text-sm text-muted-foreground">
                No subscription payments found
              </p>

            )}

          </div>

        </CardContent>

      </Card>

    </div>
  )
}