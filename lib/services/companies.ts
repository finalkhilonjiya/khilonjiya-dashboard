import { createAdminClient } from '@/lib/supabase/server'

export interface CompanyFilters {
  search?: string
  industry?: string
  isVerified?: boolean
  page?: number
  limit?: number
}

export async function getCompanies(filters: CompanyFilters = {}) {
  const supabase = await createAdminClient()
  const { search, industry, isVerified, page = 1, limit = 10 } = filters

  let query = supabase
    .from('companies')
    .select(`
      *,
      business_types_master(type_name)
    `, { count: 'exact' })

  if (industry) query = query.eq('industry', industry)
  if (isVerified !== undefined) query = query.eq('is_verified', isVerified)
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return { companies: data || [], total: count || 0 }
}

export async function getCompanyById(id: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      business_types_master(type_name),
      user_profiles!owner_id(id, full_name, email, mobile_number)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getCompanyJobs(companyId: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
}

export async function getCompanyStats() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: verified },
    { count: unverified },
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_verified', false),
  ])

  return {
    total: total || 0,
    verified: verified || 0,
    unverified: unverified || 0,
  }
}

export async function updateCompanyVerification(id: string, isVerified: boolean) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('companies')
    .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function getIndustries() {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('companies')
    .select('industry')
    .not('industry', 'is', null)

  const industries = [...new Set((data || []).map(c => c.industry).filter(Boolean))]
  return industries.sort()
}
