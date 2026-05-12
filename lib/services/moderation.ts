import { createAdminClient } from '@/lib/supabase/server'

export interface ReportFilters {
  status?: string
  itemType?: string
  page?: number
  limit?: number
}

export async function getReports(filters: ReportFilters = {}) {
  const supabase = await createAdminClient()
  const { status, itemType, page = 1, limit = 10 } = filters

  let query = supabase
    .from('reports')
    .select(`
      *,
      user_profiles!reporter_id(full_name, email)
    `, { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (itemType) query = query.eq('reported_item_type', itemType)

  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return { reports: data || [], total: count || 0 }
}

export async function getReportStats() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: pending },
    { count: reviewed },
    { count: resolved },
  ] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'reviewed'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
  ])

  return {
    total: total || 0,
    pending: pending || 0,
    reviewed: reviewed || 0,
    resolved: resolved || 0,
  }
}

export async function updateReportStatus(id: string, status: string, moderatorNotes?: string) {
  const supabase = await createAdminClient()

  const updates: Record<string, unknown> = { status }
  if (moderatorNotes) updates.moderator_notes = moderatorNotes
  if (status === 'resolved') updates.resolved_at = new Date().toISOString()

  const { error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function getAdminActions(page: number = 1, limit: number = 10) {
  const supabase = await createAdminClient()

  const offset = (page - 1) * limit
  const { data, count, error } = await supabase
    .from('admin_actions')
    .select(`
      *,
      user_profiles!admin_user_id(full_name, email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return { actions: data || [], total: count || 0 }
}

export async function logAdminAction(
  adminUserId: string,
  actionType: string,
  targetType?: string,
  targetId?: string,
  notes?: string
) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from('admin_actions').insert({
    admin_user_id: adminUserId,
    action_type: actionType,
    target_type: targetType,
    target_id: targetId,
    notes,
  })

  if (error) throw error
}
