import { createAdminClient } from '@/lib/supabase/server'

export interface ApplicationFilters {
  status?: string
  search?: string
  page?: number
  limit?: number
}

export async function getApplications(filters: ApplicationFilters = {}) {
  const supabase = await createAdminClient()
  const { status, search, page = 1, limit = 10 } = filters

  let query = supabase
    .from('job_applications_listings')
    .select(`
      *,
      job_applications!inner(id, name, email, phone, skills, resume_file_url, photo_file_url),
      job_listings!inner(id, job_title, company_id, companies!inner(name))
    `, { count: 'exact' })

  if (status) query = query.eq('application_status', status)
  if (search) {
    query = query.or(`job_applications.name.ilike.%${search}%,job_applications.email.ilike.%${search}%`)
  }

  const offset = (page - 1) * limit
  query = query.order('applied_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return { applications: data || [], total: count || 0 }
}

export async function getApplicationStats() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: applied },
    { count: viewed },
    { count: shortlisted },
    { count: interviewed },
    { count: selected },
    { count: rejected },
  ] = await Promise.all([
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }),
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }).eq('application_status', 'applied'),
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }).eq('application_status', 'viewed'),
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }).eq('application_status', 'shortlisted'),
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }).eq('application_status', 'interviewed'),
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }).eq('application_status', 'selected'),
    supabase.from('job_applications_listings').select('*', { count: 'exact', head: true }).eq('application_status', 'rejected'),
  ])

  return {
    total: total || 0,
    applied: applied || 0,
    viewed: viewed || 0,
    shortlisted: shortlisted || 0,
    interviewed: interviewed || 0,
    selected: selected || 0,
    rejected: rejected || 0,
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('job_applications_listings')
    .update({ application_status: status })
    .eq('id', id)

  if (error) throw error
}
