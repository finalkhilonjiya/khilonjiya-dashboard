import { getJobById } from '@/lib/services/jobs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, MapPin, Calendar, Eye, FileText, Star, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { JobActions } from './job-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params

  let job
  try {
    job = await getJobById(id)
  } catch {
    notFound()
  }

  if (!job) notFound()

  const company = job.companies as { id: string; name: string; logo_url: string | null; is_verified: boolean; website: string | null; description: string | null }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{job.job_title}</h1>
            {job.is_premium && (
              <Badge className="bg-amber-500">
                <Star className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
            {job.is_urgent && (
              <Badge variant="destructive">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Urgent
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{company.name}</p>
        </div>
        <JobActions job={job} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Type:</span> {job.job_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Location:</span> {job.district}, {job.job_address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Posted:</span> {format(new Date(job.created_at), 'PPP')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Views:</span> {job.views_count}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Applications:</span> {job.applications_count}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Salary Range</h3>
                <p className="text-lg font-medium">
                  {job.salary_min.toLocaleString('en-IN')} - {job.salary_max.toLocaleString('en-IN')} INR
                  <span className="text-sm text-muted-foreground ml-2">/{job.salary_period || 'Monthly'}</span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.job_description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
              </div>

              {job.responsibilities && (
                <div>
                  <h3 className="font-semibold mb-2">Responsibilities</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.responsibilities}</p>
                </div>
              )}

              {job.benefits && (
                <div>
                  <h3 className="font-semibold mb-2">Benefits</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.benefits}</p>
                </div>
              )}

              {job.skills_required && job.skills_required.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills_required as string[]).map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  job.status === 'active'
                    ? 'default'
                    : job.status === 'pending'
                    ? 'secondary'
                    : 'destructive'
                }
                className="text-base px-4 py-1"
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              {job.expires_at && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Expires: {format(new Date(job.expires_at), 'PPP')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
              <CardDescription>{company.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.description && (
                <p className="text-sm text-muted-foreground">{company.description}</p>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Visit Website
                </a>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/companies/${company.id}`}>
                  View Company
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education & Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Education Required</p>
                <p className="font-medium">{job.education_required}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience Required</p>
                <p className="font-medium">{job.experience_required}</p>
              </div>
              {job.work_mode && (
                <div>
                  <p className="text-sm text-muted-foreground">Work Mode</p>
                  <p className="font-medium">{job.work_mode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
