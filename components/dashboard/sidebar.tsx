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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  )
}

function formatFullDate(value: string) {
  return new Date(value).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
}

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

function ChartCard({
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <Card className="overflow-hidden">

      <CardHeader>

        <CardTitle className="text-base sm:text-lg">
          {title}
        </CardTitle>

        {description && (
          <CardDescription className="text-xs sm:text-sm">
            {description}
          </CardDescription>
        )}

      </CardHeader>

      <CardContent className="overflow-hidden">
        {children}
      </CardContent>

    </Card>
  )
}

interface TrendChartProps {
  title: string
  description?: string
  data: Array<{
    date: string
    [key: string]: string | number
  }>
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
    <ChartCard
      title={title}
      description={description}
    >

      <div className="h-[240px] w-full overflow-hidden sm:h-[300px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id={`gradient-${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor={color}
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor={color}
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={formatFullDate}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={`url(#gradient-${dataKey})`}
              strokeWidth={2}
              isAnimationActive={false}
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
    <ChartCard
      title={title}
      description={description}
    >

      <div className="h-[240px] w-full overflow-hidden sm:h-[300px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={formatFullDate}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
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
  data: Array<{
    name: string
    [key: string]: string | number
  }>
  dataKey: string
}

export function HorizontalBarChart({
  title,
  description,
  data,
  dataKey,
}: BarChartProps) {
  return (
    <ChartCard
      title={title}
      description={description}
    >

      <div className="h-[260px] w-full overflow-hidden sm:h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              type="number"
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={80}
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Bar
              dataKey={dataKey}
              fill="hsl(var(--chart-1))"
              radius={[0, 6, 6, 0]}
              isAnimationActive={false}
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
  data: Array<{
    name: string
    value: number
  }>
}

export function DonutChart({
  title,
  description,
  data,
}: PieChartProps) {
  return (
    <ChartCard
      title={title}
      description={description}
    >

      <div className="h-[300px] w-full overflow-hidden sm:h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >

              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip contentStyle={tooltipStyle} />

            <Legend
              wrapperStyle={{
                fontSize: '11px',
                paddingTop: '10px',
              }}
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
  lines: Array<{
    dataKey: string
    color: string
    name: string
  }>
}

export function MultiLineChart({
  title,
  description,
  data,
  lines,
}: MultiLineChartProps) {
  return (
    <ChartCard
      title={title}
      description={description}
    >

      <div className="h-[260px] w-full overflow-hidden sm:h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              className="text-[10px] sm:text-xs"
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={formatFullDate}
            />

            <Legend
              wrapperStyle={{
                fontSize: '11px',
              }}
            />

            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}

          </LineChart>

        </ResponsiveContainer>

      </div>

    </ChartCard>
  )
}