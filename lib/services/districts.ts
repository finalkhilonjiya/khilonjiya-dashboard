import { createClient } from "@/lib/supabase/server"

export interface District {
  id: string
  name: string
  state: string
  region?: string
  is_active: boolean
  created_at: string
  updated_at: string
  job_count?: number
  company_count?: number
}

export async function getDistricts(filters?: {
  state?: string
  isActive?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from("districts")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })

  if (filters?.state) {
    query = query.eq("state", filters.state)
  }

  if (filters?.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive)
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching districts:", error)
    return { data: [], count: 0 }
  }

  return { data: data as District[], count: count || 0 }
}

export async function getDistrictById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("districts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching district:", error)
    return null
  }

  return data as District
}

export async function updateDistrictStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("districts")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating district status:", error)
    return false
  }

  return true
}

export async function getDistrictStats() {
  const supabase = await createClient()
  
  const { count: totalDistricts } = await supabase
    .from("districts")
    .select("*", { count: "exact", head: true })

  const { count: activeDistricts } = await supabase
    .from("districts")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { data: stateData } = await supabase
    .from("districts")
    .select("state")

  const uniqueStates = new Set(stateData?.map(d => d.state) || [])

  return {
    totalDistricts: totalDistricts || 0,
    activeDistricts: activeDistricts || 0,
    totalStates: uniqueStates.size
  }
}
