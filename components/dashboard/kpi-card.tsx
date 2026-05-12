

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface KPICardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: KPICardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-md',
        className
      )}
    >

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">

        <div className="space-y-1">

          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>

        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">

          <Icon className="h-4 w-4 text-muted-foreground" />

        </div>

      </CardHeader>

      <CardContent>

        <div className="text-2xl font-bold tracking-tight md:text-3xl">
          {value}
        </div>

        {(description || trend) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">

            {trend && (
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-xs font-medium',
                  trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}

            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}

          </div>
        )}

      </CardContent>

    </Card>
  )
}