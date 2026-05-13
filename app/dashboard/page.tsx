<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

  <KPICard
    title="Total Users"
    value={formatNumber(stats.totalUsers)}
    description="Registered users"
    icon={Users}
  />

  <KPICard
    title="Active Users"
    value={formatNumber(stats.activeUsers)}
    description="Last 7 days"
    icon={UserCheck}
  />

  <KPICard
    title="Companies"
    value={formatNumber(stats.totalCompanies)}
    description="Registered companies"
    icon={Building2}
  />

  <KPICard
    title="Active Jobs"
    value={formatNumber(stats.activeJobs)}
    description="Currently live"
    icon={Briefcase}
  />

  <KPICard
    title="Applications Today"
    value={formatNumber(stats.applicationsToday)}
    description="New applications"
    icon={FileText}
  />

</div>

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

  <KPICard
    title="Revenue MTD"
    value={formatCurrency(stats.revenueMTD)}
    description="Month to date"
    icon={CreditCard}
  />

  <KPICard
    title="Active Subscriptions"
    value={formatNumber(stats.activeSubscriptions)}
    description="Paying users"
    icon={Activity}
  />

  <KPICard
    title="Employers"
    value={formatNumber(stats.totalEmployers)}
    description="Registered employers"
    icon={Clock}
  />

  <KPICard
    title="Pending Reports"
    value={formatNumber(stats.pendingReports)}
    description="Needs review"
    icon={Flag}
    className={
      stats.pendingReports > 0
        ? 'border-amber-500/50'
        : ''
    }
  />

  <KPICard
    title="Construction Requests"
    value={formatNumber(stats.pendingConstructionRequests)}
    description="Pending requests"
    icon={HardHat}
  />

</div>

<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

  <TrendAreaChart
    title="User Registrations"
    description="New users over the last 30 days"
    data={userTrend}
    dataKey="users"
    color="hsl(var(--chart-1))"
  />

  <TrendLineChart
    title="Job Postings"
    description="Jobs posted over the last 30 days"
    data={jobTrend}
    dataKey="jobs"
    color="hsl(var(--chart-2))"
  />

</div>

<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

  <TrendAreaChart
    title="Applications"
    description="Applications over the last 30 days"
    data={applicationTrend}
    dataKey="applications"
    color="hsl(var(--chart-3))"
  />

  <TrendLineChart
    title="Revenue"
    description="Revenue over the last 30 days"
    data={revenueTrend}
    dataKey="revenue"
    color="hsl(var(--chart-4))"
  />

</div>

<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

  <DonutChart
    title="Jobs by Category"
    description="Distribution of active jobs"
    data={jobsByCategory}
  />

  <HorizontalBarChart
    title="Top Districts"
    description="Districts with highest job listings"
    data={topDistricts}
    dataKey="jobs"
  />

</div>

<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">