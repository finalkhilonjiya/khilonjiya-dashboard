// lib/services/revenue.ts

import { createAdminClient } from '@/lib/supabase/server'

export async function getRevenueStats() {
  const supabase = await createAdminClient()

  const now = new Date()

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString()

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toISOString()

  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  ).toISOString()

  const currentTime = new Date().toISOString()

  const successfulStatuses = [
    'active',
    'completed',
    'paid',
  ]

  const [
    { data: thisMonthSubscriptions },
    { data: lastMonthSubscriptions },
    { count: activeSubscriptions },
    { count: totalTransactions },
  ] = await Promise.all([

    supabase
      .from('user_subscriptions')
      .select(`
        amount_rupees,
        created_at,
        status
      `)
      .in('status', successfulStatuses)
      .gte('created_at', startOfMonth),

    supabase
      .from('user_subscriptions')
      .select(`
        amount_rupees,
        created_at,
        status
      `)
      .in('status', successfulStatuses)
      .gte('created_at', startOfLastMonth)
      .lte('created_at', endOfLastMonth),

    supabase
      .from('user_subscriptions')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'active')
      .gte('expires_at', currentTime),

    supabase
      .from('user_subscriptions')
      .select('*', {
        count: 'exact',
        head: true,
      }),
  ])

  const revenueMTD =
    (thisMonthSubscriptions || []).reduce(
      (sum, item) =>
        sum +
        Number(item.amount_rupees || 0),
      0
    )

  const revenueLastMonth =
    (lastMonthSubscriptions || []).reduce(
      (sum, item) =>
        sum +
        Number(item.amount_rupees || 0),
      0
    )

  return {
    revenueMTD,

    revenueLastMonth,

    activeSubscriptions:
      activeSubscriptions || 0,

    totalTransactions:
      totalTransactions || 0,

    growthPercent:
      revenueLastMonth > 0
        ? (
            ((revenueMTD -
              revenueLastMonth) /
              revenueLastMonth) *
            100
          )
        : 0,
  }
}

export async function getTransactions(
  page: number = 1,
  limit: number = 10
) {
  const supabase = await createAdminClient()

  const offset = (page - 1) * limit

  const {
    data,
    count,
    error,
  } = await supabase
    .from('user_subscriptions')
    .select(
      `
      *,
      user_profiles!user_subscriptions_user_id_fkey(
        full_name,
        email,
        mobile_number,
        role,
        avatar_url,
        current_city,
        current_state
      )
    `,
      {
        count: 'exact',
      }
    )
    .order('created_at', {
      ascending: false,
    })
    .range(
      offset,
      offset + limit - 1
    )

  if (error) {
    throw error
  }

  return {
    transactions: data || [],
    total: count || 0,
  }
}

export async function getMonthlyRevenueTrend(
  months: number = 6
) {
  const supabase = await createAdminClient()

  const startDate = new Date()

  startDate.setMonth(
    startDate.getMonth() - months
  )

  const { data, error } =
    await supabase
      .from('user_subscriptions')
      .select(`
        amount_rupees,
        created_at,
        status
      `)
      .in('status', [
        'active',
        'completed',
        'paid',
      ])
      .gte(
        'created_at',
        startDate.toISOString()
      )
      .order('created_at', {
        ascending: true,
      })

  if (error) {
    throw error
  }

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const month = new Date(
        item.created_at
      ).toLocaleDateString(
        'en-IN',
        {
          year: 'numeric',
          month: 'short',
        }
      )

      acc[month] =
        (acc[month] || 0) +
        Number(item.amount_rupees || 0)

      return acc
    },
    {}
  )

  return Object.entries(grouped).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  )
}