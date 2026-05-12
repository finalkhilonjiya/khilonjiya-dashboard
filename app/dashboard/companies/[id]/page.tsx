import { getCompanyById, getCompanyJobs } from '@/lib/services/companies'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Building2, MapPin, Calendar, Globe, Star, Users, Briefcase, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { CompanyActions } from './company-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params

  let company
  let jobs: Awaited<ReturnType<typeof getCompanyJobs>> = []
  try {
    company = await getCompanyById(id)
    jobs = await getCompanyJobs(id)
  } catch {
    notFound()
  }

  if (!company) notFound()

  const businessType = company.business_types_master as { type_name: string } | null
  const owner = company.user_profiles as { id: string; full_name: string | null; email: string | null; mobile_number: string | null } | null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/companies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Avatar className="h-16 w-16">
          <AvatarImage src={company.logo_url || undefined} alt={company.name} />
          <AvatarFallback className="text-xl">{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
            {company.is_verified && (
              <Badge className="bg-blue-500">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{company.industry || 'No industry specified'}</p>
        </div>
        <CompanyActions company={company} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Type:</span> {businessType?.type_name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Size:</span> {company.company_size || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Location:</span>{' '}
                    {company.headquarters_city || 'N/A'}
                    {company.headquarters_state && `, ${company.headquarters_state}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Founded:</span> {company.founded_year || 'N/A'}
                  </span>
                </div>
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>

              {company.description && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Active Jobs ({jobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="font-medium hover:underline"
                        >
                          {job.job_title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {job.district} - {job.applications_count} applications
                        </p>
                      </div>
                      <Badge
                        variant={
                          job.status === 'active'
                            ? 'default'
                            : job.status === 'pending'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active jobs
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Jobs</span>
                <span className="font-medium">{company.total_jobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                {company.rating ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{company.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reviews</span>
                <span className="font-medium">{company.total_reviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {format(new Date(company.created_at), 'MMM yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {owner && (
            <Card>
              <CardHeader>
                <CardTitle>Owner</CardTitle>
                <CardDescription>Company administrator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{owner.full_name || 'N/A'}</p>
                {owner.email && (
                  <p className="text-sm text-muted-foreground">{owner.email}</p>
                )}
                {owner.mobile_number && (
                  <p className="text-sm text-muted-foreground">{owner.mobile_number}</p>
                )}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/dashboard/users/${owner.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {company.is_verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-blue-600">Verified Company</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Not Verified</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
