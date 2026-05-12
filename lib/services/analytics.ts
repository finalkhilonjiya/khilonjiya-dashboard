import { createClient } from "@/lib/supabase/server"

export interface SearchTrend {
  id: string
  query: string
  count: number
  category?: string
  district?: string
  created_at: string
}

export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  avgSessionDuration: number
  bounceRate: number
  topPages: { page: string; views: number }[]
  trafficSources: { source: string; count: number }[]
  deviceBreakdown: { device: string; percentage: number }[]
}

export async function getSearchTrends(filters?: {
  category?: string
  district?: string
  startDate?: string
  endDate?: string
  limit?: number
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from("search_trends")
    .select("*")
    .order("count", { ascending: false })

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.district) {
    query = query.eq("district", filters.district)
  }

  if (filters?.startDate) {
    query = query.gte("created_at", filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte("created_at", filters.endDate)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  } else {
    query = query.limit(20)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching search trends:", error)
    return []
  }

  return data as SearchTrend[]
}

export async function getAnalyticsOverview(period: "day" | "week" | "month" = "week") {
  const supabase = await createClient()
  
  const now = new Date()
  let startDate: Date

  switch (period) {
    case "day":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }

  // Get page views data
  const { data: analyticsData } = await supabase
    .from("analytics_events")
    .select("*")
    .gte("created_at", startDate.toISOString())

  // Calculate metrics from data
  const pageViews = analyticsData?.length || 0
  const uniqueVisitors = new Set(analyticsData?.map(e => e.user_id) || []).size

  return {
    pageViews,
    uniqueVisitors,
    avgSessionDuration: 245, // seconds - placeholder
    bounceRate: 42.5, // percentage - placeholder
    topPages: [
      { page: "/jobs", views: Math.floor(pageViews * 0.35) },
      { page: "/companies", views: Math.floor(pageViews * 0.25) },
      { page: "/construction", views: Math.floor(pageViews * 0.20) },
      { page: "/applications", views: Math.floor(pageViews * 0.12) },
      { page: "/profile", views: Math.floor(pageViews * 0.08) },
    ],
    trafficSources: [
      { source: "Direct", count: Math.floor(uniqueVisitors * 0.40) },
      { source: "Search", count: Math.floor(uniqueVisitors * 0.30) },
      { source: "Social", count: Math.floor(uniqueVisitors * 0.20) },
      { source: "Referral", count: Math.floor(uniqueVisitors * 0.10) },
    ],
    deviceBreakdown: [
      { device: "Mobile", percentage: 65 },
      { device: "Desktop", percentage: 28 },
      { device: "Tablet", percentage: 7 },
    ],
  } as AnalyticsData
}

export async function getUserActivityTrend(days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data } = await supabase
    .from("users")
    .select("created_at")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true })

  // Group by date
  const dailyCounts: Record<string, number> = {}
  
  data?.forEach(user => {
    const date = new Date(user.created_at).toISOString().split("T")[0]
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  })

  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }))
}
