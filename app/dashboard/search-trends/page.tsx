import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, MapPin, Tag } from "lucide-react"
import { getSearchTrends } from "@/lib/services/analytics"

export default async function SearchTrendsPage() {
  const trends = await getSearchTrends({ limit: 50 })

  const topTrends = trends.slice(0, 10)
  const categories = [...new Set(trends.map(t => t.category).filter(Boolean))]
  const districts = [...new Set(trends.map(t => t.district).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Trends</h1>
        <p className="text-muted-foreground">
          Discover what users are searching for on the platform
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Searches
            </CardTitle>
            <CardDescription>
              Most popular search queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topTrends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No search data yet</p>
                <p className="text-sm text-muted-foreground">
                  Search trends will appear here as users search
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topTrends.map((trend, index) => (
                  <div
                    key={trend.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground w-8">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{trend.query}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {trend.category && (
                            <Badge variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {trend.category}
                            </Badge>
                          )}
                          {trend.district && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              {trend.district}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{trend.count.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">searches</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Top Categories
              </CardTitle>
              <CardDescription>
                Most searched categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No category data available
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 10).map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Districts
              </CardTitle>
              <CardDescription>
                Most searched locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {districts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No location data available
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {districts.slice(0, 10).map((district) => (
                    <Badge key={district} variant="outline">
                      {district}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Searches</span>
                  <span className="font-semibold">
                    {trends.reduce((sum, t) => sum + t.count, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Unique Queries</span>
                  <span className="font-semibold">{trends.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="font-semibold">{categories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Districts</span>
                  <span className="font-semibold">{districts.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
