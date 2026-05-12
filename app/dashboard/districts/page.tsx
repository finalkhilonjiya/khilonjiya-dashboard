import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Building2, Briefcase, Activity } from "lucide-react"
import { getDistricts, getDistrictStats } from "@/lib/services/districts"
import { DistrictsTable } from "./districts-table"
import { KpiCard } from "@/components/dashboard/kpi-card"

export default async function DistrictsPage() {
  const [{ data: districts, count }, stats] = await Promise.all([
    getDistricts({ limit: 50 }),
    getDistrictStats()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Districts</h1>
        <p className="text-muted-foreground">
          Manage service areas and geographic regions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Districts"
          value={stats.totalDistricts}
          icon={MapPin}
          trend={{ value: 0, isPositive: true }}
        />
        <KpiCard
          title="Active Districts"
          value={stats.activeDistricts}
          icon={Activity}
          trend={{ value: 0, isPositive: true }}
        />
        <KpiCard
          title="States Covered"
          value={stats.totalStates}
          icon={Building2}
          trend={{ value: 0, isPositive: true }}
        />
        <KpiCard
          title="Avg Jobs/District"
          value={stats.totalDistricts > 0 ? Math.round(count / stats.totalDistricts) : 0}
          icon={Briefcase}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Districts</CardTitle>
          <CardDescription>
            {count} districts found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <DistrictsTable initialData={districts} totalCount={count} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
