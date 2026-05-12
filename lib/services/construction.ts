import { createAdminClient } from '@/lib/supabase/server'

export interface ConstructionFilters {
  status?: string
  serviceType?: string
  search?: string
  page?: number
  limit?: number
}

export async function getConstructionRequests(filters: ConstructionFilters = {}) {
  const supabase = await createAdminClient()
  const { status, serviceType, search, page = 1, limit = 10 } = filters

  let query = supabase
    .from('construction_service_requests')
    .select('*', { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (serviceType) query = query.eq('service_type', serviceType)
  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,project_address.ilike.%${search}%`)
  }

  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  return { requests: data || [], total: count || 0 }
}

export async function getConstructionRequestById(id: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('construction_service_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getConstructionStats() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: pending },
    { count: inProgress },
    { count: completed },
    { data: quoteData },
  ] = await Promise.all([
    supabase.from('construction_service_requests').select('*', { count: 'exact', head: true }),
    supabase.from('construction_service_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('construction_service_requests').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    supabase.from('construction_service_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('construction_service_requests').select('quote_amount').not('quote_amount', 'is', null),
  ])

  const totalQuoteValue = (quoteData || []).reduce((sum, r) => sum + (r.quote_amount || 0), 0)

  return {
    total: total || 0,
    pending: pending || 0,
    inProgress: inProgress || 0,
    completed: completed || 0,
    totalQuoteValue,
  }
}

export async function updateConstructionRequestStatus(id: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('construction_service_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function updateConstructionRequestQuote(id: string, quoteAmount: number, adminNotes?: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('construction_service_requests')
    .update({ 
      quote_amount: quoteAmount, 
      admin_notes: adminNotes,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)

  if (error) throw error
}

export async function getServiceTypes() {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('construction_service_requests')
    .select('service_type')

  const types = [...new Set((data || []).map(r => r.service_type).filter(Boolean))]
  return types.sort()
}
