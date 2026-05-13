'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>

        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

interface TrendChartProps {
  title: string
  description?: string
  data: Array<{ date: string; [key: string]: string | number }>
  dataKey: string
  color?: string
}

export function TrendAreaChart({
  title,
  description,
  data,
  dataKey,
  color = 'hsl(var(--chart-1))',
}: TrendChartProps) {
  return (
    <ChartCard title={title} description={description}>

      <div className="h-[250px] w-full overflow-hidden sm:h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>
              <linearGradient
                id={`gradient-${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric' }
                )
              }
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )
              }
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={`url(#gradient-${dataKey})`}
              strokeWidth={2}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </ChartCard>
  )
}

export function TrendLineChart({
  title,
  description,
  data,
  dataKey,
  color = 'hsl(var(--chart-2))',
}: TrendChartProps) {
  return (
    <ChartCard title={title} description={description}>

      <div className="h-[250px] w-full overflow-hidden sm:h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric' }
                )
              }
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )
              }
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </ChartCard>
  )
}

interface BarChartProps {
  title: string
  description?: string
  data: Array<{ name: string; [key: string]: string | number }>
  dataKey: string
}

export function HorizontalBarChart({
  title,
  description,
  data,
  dataKey,
}: BarChartProps) {
  return (
    <ChartCard title={title} description={description}>

      <div className="h-[250px] w-full overflow-hidden sm:h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            layout="vertical"
          >

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              type="number"
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              className="text-xs"
              tickLine={false}
              axisLine={false}
              width={100}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />

            <Bar
              dataKey={dataKey}
              fill="hsl(var(--chart-1))"
              radius={[0, 4, 4, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </ChartCard>
  )
}

interface PieChartProps {
  title: string
  description?: string
  data: Array<{ name: string; value: number }>
}

export function DonutChart({
  title,
  description,
  data,
}: PieChartProps) {
  return (
    <ChartCard title={title} description={description}>

      <div className="h-[250px] w-full overflow-hidden sm:h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >

              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />

            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-xs text-foreground">
                  {value}
                </span>
              )}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </ChartCard>
  )
}

interface MultiLineChartProps {
  title: string
  description?: string
  data: Array<Record<string, string | number>>
  lines: Array<{ dataKey: string; color: string; name: string }>
}

export function MultiLineChart({
  title,
  description,
  data,
  lines,
}: MultiLineChartProps) {
  return (
    <ChartCard title={title} description={description}>

      <div className="h-[250px] w-full overflow-hidden sm:h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric' }
                )
              }
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )
              }
            />

            <Legend />

            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
              />
            ))}

          </LineChart>

        </ResponsiveContainer>

      </div>

    </ChartCard>
  )
}