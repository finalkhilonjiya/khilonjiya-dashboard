import { getRevenueStats, getTransactions, getMonthlyRevenueTrend } from '@/lib/services/revenue'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IndianRupee, TrendingUp, Users, CreditCard } from 'lucide-react'
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

interface PageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function RevenuePage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')

  const [stats, { transactions }, revenueTrend] = await Promise.all([
    getRevenueStats(),
    getTransactions(page, 10),
    getMonthlyRevenueTrend(6),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue & Payments</h1>
        <p className="text-muted-foreground">
          Monitor revenue, subscriptions, and payment transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Revenue MTD"
          value={formatCurrency(stats.revenueMTD)}
          description="This month"
          icon={IndianRupee}
          trend={stats.growthPercent !== 0 ? {
            value: Math.round(stats.growthPercent),
            isPositive: stats.growthPercent > 0,
          } : undefined}
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
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {(tx.user_profiles as { full_name: string | null })?.full_name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(tx.user_profiles as { email: string | null })?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.plan_key} - {format(new Date(tx.created_at), 'PPp')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(tx.amount_inr)}</p>
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
            ))}
            {transactions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transactions found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
