import { createAdminClient } from '@/lib/supabase/server'

export interface JobFilters {
  status?: string
  search?: string
  district?: string
  category?: string
  isPremium?: boolean
  isUrgent?: boolean
  page?: number
  limit?: number
}

export async function getJobs(filters: JobFilters = {}) {
  const supabase = await createAdminClient()
  const { status, search, district, category, isPremium, isUrgent, page = 1, limit = 10 } = filters

  let query = supabase
    .from('job_listings')
    .select(`
      *,
      companies!inner(id, name, logo_url, is_verified)
    `, { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (district) query = query.eq('district', district)
  if (category) query = query.eq('job_category', category)
  if (isPremium !== undefined) query = query.eq('is_premium', isPremium)
  if (isUrgent !== undefined) query = query.eq('is_urgent', isUrgent)
  if (search) {
    query = query.or(`job_title.ilike.%${search}%,job_description.ilike.%${search}%`)
  }

  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return { jobs: data || [], total: count || 0 }
}

export async function getJobById(id: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('job_listings')
    .select(`
      *,
      companies!inner(id, name, logo_url, is_verified, website, description),
      user_profiles!employer_id(id, full_name, email, mobile_number)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateJobStatus(id: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('job_listings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function toggleJobPremium(id: string, isPremium: boolean) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('job_listings')
    .update({ 
      is_premium: isPremium, 
      premium_expires_at: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)

  if (error) throw error
}

export async function toggleJobUrgent(id: string, isUrgent: boolean) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('job_listings')
    .update({ is_urgent: isUrgent, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function getJobStats() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: active },
    { count: pending },
    { count: closed },
    { count: expired },
    { count: premium },
    { count: urgent },
  ] = await Promise.all([
    supabase.from('job_listings').select('*', { count: 'exact', head: true }),
    supabase.from('job_listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('job_listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('job_listings').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
    supabase.from('job_listings').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    supabase.from('job_listings').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    supabase.from('job_listings').select('*', { count: 'exact', head: true }).eq('is_urgent', true),
  ])

  return {
    total: total || 0,
    active: active || 0,
    pending: pending || 0,
    closed: closed || 0,
    expired: expired || 0,
    premium: premium || 0,
    urgent: urgent || 0,
  }
}

export async function getJobCategories() {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('job_categories_master')
    .select('id, category_name')
    .eq('is_active', true)
    .order('category_name')

  return data || []
}

export async function getDistricts() {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('assam_districts_master')
    .select('id, district_name')
    .order('district_name')

  return data || []
}
