import { createAdminClient } from '@/lib/supabase/server'

export interface UserFilters {
  role?: string
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export async function getUsers(filters: UserFilters = {}) {
  const supabase = await createAdminClient()
  const { role, search, isActive, page = 1, limit = 10 } = filters

  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact' })

  if (role) query = query.eq('role', role)
  if (isActive !== undefined) query = query.eq('is_active', isActive)
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,mobile_number.ilike.%${search}%`)
  }

  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return { users: data || [], total: count || 0 }
}

export async function getUserStats() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: jobSeekers },
    { count: employers },
    { count: active },
    { count: verified },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'job_seeker'),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
  ])

  return {
    total: total || 0,
    jobSeekers: jobSeekers || 0,
    employers: employers || 0,
    active: active || 0,
    verified: verified || 0,
  }
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}
