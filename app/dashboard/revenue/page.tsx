'use client'

import { useEffect, useState } from 'react'

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

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

interface Transaction {
  id: string
  amount_inr: number
  status: string
  plan_key: string
  created_at: string
  user_profiles:
    | {
        full_name: string | null
        email: string | null
      }
    | {
        full_name: string | null
        email: string | null
      }[]
    | null
}

interface RevenueStats {
  revenueMTD: number
  revenueLastMonth: number
  activeSubscriptions: number
  totalTransactions: number
  growthPercent: number
}

interface RevenueTrend {
  month: string
  revenue: number
}

export default function RevenuePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null)

  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, transactionData, trendData] =
          await Promise.all([
            getRevenueStats(),
            getTransactions(1, 10),
            getMonthlyRevenueTrend(6),
          ])

        setStats(statsData)
        setTransactions(transactionData.transactions || [])
        setRevenueTrend(trendData || [])
      } catch (error) {
        console.error('Revenue Page Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">
          Loading revenue dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Revenue & Payments
        </h1>

        <p className="text-muted-foreground">
          Monitor revenue, subscriptions, and payment transactions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <KPICard
          title="Revenue MTD"
          value={formatCurrency(stats.revenueMTD)}
          description="This month"
          icon={IndianRupee}
          trend={
            stats.growthPercent !== 0
              ? {
                  value: Math.round(stats.growthPercent),
                  isPositive: stats.growthPercent > 0,
                }
              : undefined
          }
        />

        <KPICard
          title="Last Month"
          value={formatCurrency(stats.revenueLastMonth)}
          description="Previous month"
          icon={TrendingUp}
        />

        <KPICard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          description="Paying users"
          icon={Users}
        />

        <KPICard
          title="Total Transactions"
          value={stats.totalTransactions}
          description="All time"
          icon={CreditCard}
        />

      </div>

      {/* Revenue Chart */}
      <Card>

        <CardHeader>
          <CardTitle>
            Monthly Revenue
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={revenueTrend}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />

                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${(value / 1000).toFixed(0)}K`
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Revenue',
                  ]}
                />

                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </CardContent>

      </Card>

      {/* Transactions */}
      <Card>

        <CardHeader>
          <CardTitle>
            Recent Transactions
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            {transactions.map((tx) => {
              const profile = Array.isArray(tx.user_profiles)
                ? tx.user_profiles[0]
                : tx.user_profiles

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >

                  <div className="space-y-1">

                    <p className="font-medium">
                      {profile?.full_name || 'Unknown User'}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {profile?.email || 'No email'}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {tx.plan_key} —{' '}
                      {format(new Date(tx.created_at), 'PPp')}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-medium">
                      {formatCurrency(tx.amount_inr)}
                    </p>

                    <Badge
                      variant={
                        tx.status === 'paid'
                          ? 'default'
                          : tx.status === 'created'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {tx.status}
                    </Badge>

                  </div>

                </div>
              )
            })}

            {transactions.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No transactions found
              </p>
            )}

          </div>

        </CardContent>

      </Card>

    </div>
  )
}