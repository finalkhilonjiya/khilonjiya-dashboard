import { createAdminClient } from '@/lib/supabase/server'

export async function getRevenueStats() {
  const supabase = await createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

  const [
    { data: thisMonthPayments },
    { data: lastMonthPayments },
    { count: activeSubscriptions },
    { count: totalTransactions },
  ] = await Promise.all([
    supabase
      .from('payment_transactions')
      .select('amount_inr')
      .eq('status', 'paid')
      .gte('paid_at', startOfMonth),
    supabase
      .from('payment_transactions')
      .select('amount_inr')
      .eq('status', 'paid')
      .gte('paid_at', startOfLastMonth)
      .lte('paid_at', endOfLastMonth),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('payment_transactions').select('*', { count: 'exact', head: true }),
  ])

  const revenueMTD = (thisMonthPayments || []).reduce((sum, p) => sum + (p.amount_inr || 0), 0)
  const revenueLastMonth = (lastMonthPayments || []).reduce((sum, p) => sum + (p.amount_inr || 0), 0)

  return {
    revenueMTD,
    revenueLastMonth,
    activeSubscriptions: activeSubscriptions || 0,
    totalTransactions: totalTransactions || 0,
    growthPercent: revenueLastMonth > 0 ? ((revenueMTD - revenueLastMonth) / revenueLastMonth) * 100 : 0,
  }
}

export async function getTransactions(page: number = 1, limit: number = 10) {
  const supabase = await createAdminClient()

  const offset = (page - 1) * limit
  const { data, count, error } = await supabase
    .from('payment_transactions')
    .select(`
      *,
      user_profiles!user_id(full_name, email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return { transactions: data || [], total: count || 0 }
}

export async function getSubscriptions(page: number = 1, limit: number = 10) {
  const supabase = await createAdminClient()

  const offset = (page - 1) * limit
  const { data, count, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      user_profiles!user_id(full_name, email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return { subscriptions: data || [], total: count || 0 }
}

export async function getMonthlyRevenueTrend(months: number = 6) {
  const supabase = await createAdminClient()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data } = await supabase
    .from('payment_transactions')
    .select('amount_inr, paid_at')
    .eq('status', 'paid')
    .gte('paid_at', startDate.toISOString())
    .order('paid_at', { ascending: true })

  const grouped = (data || []).reduce((acc: Record<string, number>, item) => {
    if (!item.paid_at) return acc
    const month = new Date(item.paid_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    acc[month] = (acc[month] || 0) + (item.amount_inr || 0)
    return acc
  }, {})

  return Object.entries(grouped).map(([month, revenue]) => ({ month, revenue }))
}
