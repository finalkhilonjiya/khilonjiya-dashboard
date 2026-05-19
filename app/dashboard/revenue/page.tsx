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

                      <p className="text-xs text-muted-foreground">
                        {profile?.email ||
                          'No email'}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {profile?.mobile_number ||
                          'No mobile'}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {profile?.current_city || ''}
                        {profile?.current_city &&
                        profile?.current_state
                          ? ', '
                          : ''}
                        {profile?.current_state ||
                          ''}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Plan:{' '}
                        {tx.plan_name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Platform:{' '}
                        {tx.platform}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Purchased:{' '}
                        {format(
                          new Date(
                            tx.created_at
                          ),
                          'PPpp'
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="text-right space-y-2">

                    <p className="text-lg font-bold">
                      {formatCurrency(
                        tx.amount_rupees
                      )}
                    </p>

                    <Badge
                      variant={
                        tx.status ===
                        'active'
                          ? 'default'
                          : tx.status ===
                              'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {tx.status}
                    </Badge>

                    <p className="text-xs text-muted-foreground">
                      {tx.razorpay_payment_id ||
                        'No Payment ID'}
                    </p>

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