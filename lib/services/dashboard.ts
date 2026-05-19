import { createAdminClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createAdminClient()

  const now = new Date().toISOString()

  const [
    { count: totalUsers },
    { count: totalCompanies },
    { count: activeJobs },
    { count: applicationsToday },
    { count: activeSubscriptions },
    { count: pendingReports },
    { count: pendingConstructionRequests },
    { count: totalEmployers },
  ] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('companies')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('job_listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('expires_at', now),

    supabase
      .from('job_applications_listings')
      .select('*', { count: 'exact', head: true })
      .gte(
        'applied_at',
        new Date(
          new Date().setHours(0, 0, 0, 0)
        ).toISOString()
      ),

    supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('expires_at', now),

    supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('construction_service_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'employer'),
  ])

  // =========================
  // Revenue MTD
  // =========================

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString()

  const { data: subscriptions } =
    await supabase
      .from('user_subscriptions')
      .select('amount_rupees')
      .in('status', [
        'active',
        'completed',
        'paid',
      ])
      .gte('created_at', startOfMonth)

  const revenueMTD =
    subscriptions?.reduce(
      (sum, item) =>
        sum +
        Number(item.amount_rupees || 0),
      0
    ) || 0

  // =========================
  // Active users (7 days)
  // =========================

  const sevenDaysAgo = new Date(
    Date.now() -
      7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const { count: activeUsers } =
    await supabase
      .from('user_profiles')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .gte('updated_at', sevenDaysAgo)

  return {
    totalUsers: totalUsers || 0,

    activeUsers: activeUsers || 0,

    totalEmployers:
      totalEmployers || 0,

    totalCompanies:
      totalCompanies || 0,

    activeJobs: activeJobs || 0,

    applicationsToday:
      applicationsToday || 0,

    revenueMTD,

    activeSubscriptions:
      activeSubscriptions || 0,

    pendingReports:
      pendingReports || 0,

    pendingConstructionRequests:
      pendingConstructionRequests ||
      0,
  }
}

export async function getUserRegistrationTrend(
  days: number = 30
) {
  const supabase = await createAdminClient()

  const startDate = new Date(
    Date.now() -
      days * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data } = await supabase
    .from('user_profiles')
    .select('created_at')
    .gte('created_at', startDate)
    .order('created_at', {
      ascending: true,
    })

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const date = new Date(
        item.created_at
      )
        .toISOString()
        .split('T')[0]

      acc[date] =
        (acc[date] || 0) + 1

      return acc
    },
    {}
  )

  return Object.entries(grouped).map(
    ([date, count]) => ({
      date,
      users: count,
    })
  )
}

export async function getJobPostingTrend(
  days: number = 30
) {
  const supabase = await createAdminClient()

  const startDate = new Date(
    Date.now() -
      days * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data } = await supabase
    .from('job_listings')
    .select('created_at')
    .gte('created_at', startDate)
    .order('created_at', {
      ascending: true,
    })

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const date = new Date(
        item.created_at
      )
        .toISOString()
        .split('T')[0]

      acc[date] =
        (acc[date] || 0) + 1

      return acc
    },
    {}
  )

  return Object.entries(grouped).map(
    ([date, count]) => ({
      date,
      jobs: count,
    })
  )
}

export async function getApplicationsTrend(
  days: number = 30
) {
  const supabase = await createAdminClient()

  const startDate = new Date(
    Date.now() -
      days * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data } = await supabase
    .from('job_applications_listings')
    .select('applied_at')
    .gte('applied_at', startDate)
    .order('applied_at', {
      ascending: true,
    })

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const date = new Date(
        item.applied_at
      )
        .toISOString()
        .split('T')[0]

      acc[date] =
        (acc[date] || 0) + 1

      return acc
    },
    {}
  )

  return Object.entries(grouped).map(
    ([date, count]) => ({
      date,
      applications: count,
    })
  )
}

export async function getRevenueTrend(
  days: number = 30
) {
  const supabase = await createAdminClient()

  const startDate = new Date(
    Date.now() -
      days * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data } = await supabase
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
    .gte('created_at', startDate)
    .order('created_at', {
      ascending: true,
    })

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const date = new Date(
        item.created_at
      )
        .toISOString()
        .split('T')[0]

      acc[date] =
        (acc[date] || 0) +
        Number(item.amount_rupees || 0)

      return acc
    },
    {}
  )

  return Object.entries(grouped).map(
    ([date, amount]) => ({
      date,
      revenue: amount,
    })
  )
}

export async function getJobsByCategory() {
  const supabase = await createAdminClient()

  const now = new Date().toISOString()

  const { data } = await supabase
    .from('job_listings')
    .select('job_category')
    .eq('status', 'active')
    .gte('expires_at', now)

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const category =
        item.job_category || 'Other'

      acc[category] =
        (acc[category] || 0) + 1

      return acc
    },
    {}
  )

  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
}

export async function getTopDistricts() {
  const supabase = await createAdminClient()

  const now = new Date().toISOString()

  const { data } = await supabase
    .from('job_listings')
    .select('district')
    .eq('status', 'active')
    .gte('expires_at', now)

  const grouped = (
    data || []
  ).reduce(
    (
      acc: Record<string, number>,
      item
    ) => {
      const district =
        item.district || 'Unknown'

      acc[district] =
        (acc[district] || 0) + 1

      return acc
    },
    {}
  )

  return Object.entries(grouped)
    .map(([name, jobs]) => ({
      name,
      jobs,
    }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 10)
}

export async function getRecentApplications(
  limit: number = 5
) {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('job_applications_listings')
    .select(`
      id,
      applied_at,
      application_status,
      job_applications!inner(
        name,
        email,
        phone
      ),
      job_listings!inner(
        job_title,
        company_id
      )
    `)
    .order('applied_at', {
      ascending: false,
    })
    .limit(limit)

  return data || []
}

export async function getRecentJobs(
  limit: number = 5
) {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('job_listings')
    .select(`
      id,
      job_title,
      status,
      applications_count,
      views_count,
      created_at,
      companies!inner(
        name,
        logo_url
      )
    `)
    .order('created_at', {
      ascending: false,
    })
    .limit(limit)

  return data || []
}