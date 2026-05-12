import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, Clock, TrendingDown, Monitor, Smartphone, Tablet } from "lucide-react"
import { getAnalyticsOverview, getUserActivityTrend } from "@/lib/services/analytics"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { AnalyticsCharts } from "./analytics-charts"

export default async function AnalyticsPage() {
  const [overview, activityTrend] = await Promise.all([
    getAnalyticsOverview("week"),
    getUserActivityTrend(30)
  ])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Monitor platform performance and user engagement
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Page Views"
          value={overview.pageViews.toLocaleString()}
          icon={Eye}
          trend={{ value: 12, isPositive: true }}
        />
        <KpiCard
          title="Unique Visitors"
          value={overview.uniqueVisitors.toLocaleString()}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <KpiCard
          title="Avg. Session"
          value={formatDuration(overview.avgSessionDuration)}
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
        />
        <KpiCard
          title="Bounce Rate"
          value={`${overview.bounceRate}%`}
          icon={TrendingDown}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(page.views / overview.topPages[0].views) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="font-medium">{source.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(source.count / overview.uniqueVisitors) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {source.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Activity Trend</CardTitle>
            <CardDescription>New user registrations over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts activityData={activityTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitor devices this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {overview.deviceBreakdown.map((device) => {
                const Icon = device.device === "Mobile" ? Smartphone : 
                            device.device === "Desktop" ? Monitor : Tablet
                return (
                  <div key={device.device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <span className="text-sm font-medium">{device.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
