'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

interface RevenueTrend {
  month: string
  revenue: number
}

interface RevenueChartProps {
  revenueTrend: RevenueTrend[]
}

export default function RevenueChart({
  revenueTrend,
}: RevenueChartProps) {
  return (
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
  )
}