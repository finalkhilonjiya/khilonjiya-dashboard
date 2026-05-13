'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/dashboard/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  FileText,
  Calendar,
} from 'lucide-react'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

import Link from 'next/link'

import { formatDistanceToNow } from 'date-fns'

import { updateApplicationStatusAction } from './actions'

interface Application {
  id: string
  applied_at: string
  application_status: string

  job_applications: {
    id: string
    name: string
    email: string
    phone: string
    skills: string
    resume_file_url: string | null
    photo_file_url: string | null
  }

  job_listings: {
    id: string
    job_title: string
    company_id: string

    companies: {
      name: string
    }
  }
}

interface ApplicationsTableProps {
  applications: Application[]
  total: number
  page: number
  pageCount: number

  currentFilters: {
    status?: string
    search?: string
  }
}

const statusColors: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  applied: 'secondary',
  viewed: 'outline',
  shortlisted: 'default',
  interview_scheduled: 'default',
  interviewed: 'default',
  selected: 'default',
  rejected: 'destructive',
}

export function ApplicationsTable({
  applications,
  total,
  page,
  pageCount,
  currentFilters,
}: ApplicationsTableProps) {
  const router = useRouter()

  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(
    currentFilters.search || ''
  )

  const updateFilters = (
    key: string,
    value: string | undefined
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    )

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    params.set('page', '1')

    router.push(
      `/dashboard/applications?${params.toString()}`
    )
  }

  const handleSearch = () => {
    updateFilters(
      'search',
      search || undefined
    )
  }

  const handlePageChange = (
    newPage: number
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set(
      'page',
      newPage.toString()
    )

    router.push(
      `/dashboard/applications?${params.toString()}`
    )
  }

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: 'job_applications.name',

      header: 'Applicant',

      cell: ({ row }) => {
        const app = row.original

        return (
          <div className="space-y-1 min-w-[180px]">
            <p className="font-medium">
              {app.job_applications.name}
            </p>

            <p className="text-xs text-muted-foreground break-all">
              {app.job_applications.email}
            </p>
          </div>
        )
      },
    },

    {
      accessorKey: 'job_listings.job_title',

      header: 'Job',

      cell: ({ row }) => {
        const app = row.original

        return (
          <div className="space-y-1 min-w-[180px]">
            <Link
              href={`/dashboard/jobs/${app.job_listings.id}`}
              className="font-medium hover:underline"
            >
              {app.job_listings.job_title}
            </Link>

            <p className="text-xs text-muted-foreground">
              {app.job_listings.companies.name}
            </p>
          </div>
        )
      },
    },

    {
      accessorKey: 'job_applications.phone',

      header: 'Phone',

      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {row.original.job_applications.phone}
        </span>
      ),
    },

    {
      accessorKey: 'application_status',

      header: 'Status',

      cell: ({ row }) => {
        const status =
          row.original.application_status

        return (
          <Badge
            variant={
              statusColors[status] ||
              'secondary'
            }
          >
            {status.replace('_', ' ')}
          </Badge>
        )
      },
    },

    {
      accessorKey:
        'job_applications.resume_file_url',

      header: 'Resume',

      cell: ({ row }) => {
        const resumeUrl =
          row.original.job_applications
            .resume_file_url

        return resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline text-sm whitespace-nowrap"
          >
            <FileText className="h-4 w-4" />

            View
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">
            N/A
          </span>
        )
      },
    },

    {
      accessorKey: 'applied_at',

      header: 'Applied',

      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(
            new Date(row.original.applied_at),
            {
              addSuffix: true,
            }
          )}
        </span>
      ),
    },

    {
      id: 'actions',

      cell: ({ row }) => {
        const app = row.original

        return (
          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>

                <Link
                  href={`/dashboard/jobs/${app.job_listings.id}`}
                >
                  <Eye className="mr-2 h-4 w-4" />

                  View Job
                </Link>

              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateApplicationStatusAction(
                      app.id,
                      'shortlisted'
                    )

                    router.refresh()
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />

                Shortlist
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateApplicationStatusAction(
                      app.id,
                      'interview_scheduled'
                    )

                    router.refresh()
                  })
                }
              >
                <Calendar className="mr-2 h-4 w-4" />

                Schedule Interview
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateApplicationStatusAction(
                      app.id,
                      'selected'
                    )

                    router.refresh()
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />

                Select
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={() =>
                  startTransition(async () => {
                    await updateApplicationStatusAction(
                      app.id,
                      'rejected'
                    )

                    router.refresh()
                  })
                }
              >
                <XCircle className="mr-2 h-4 w-4" />

                Reject
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="w-full space-y-4 overflow-hidden">

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

        <div className="flex w-full items-center gap-2 sm:w-auto">

          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              handleSearch()
            }
            className="w-full sm:w-64"
          />

          <Button
            variant="secondary"
            size="icon"
            onClick={handleSearch}
            className="shrink-0"
          >
            <Search className="h-4 w-4" />
          </Button>

        </div>

        <Select
          value={
            currentFilters.status || 'all'
          }
          onValueChange={(value) =>
            updateFilters(
              'status',
              value === 'all'
                ? undefined
                : value
            )
          }
        >

          <SelectTrigger className="w-full sm:w-[180px]">

            <SelectValue placeholder="Status" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="applied">
              Applied
            </SelectItem>

            <SelectItem value="viewed">
              Viewed
            </SelectItem>

            <SelectItem value="shortlisted">
              Shortlisted
            </SelectItem>

            <SelectItem value="interview_scheduled">
              Interview Scheduled
            </SelectItem>

            <SelectItem value="interviewed">
              Interviewed
            </SelectItem>

            <SelectItem value="selected">
              Selected
            </SelectItem>

            <SelectItem value="rejected">
              Rejected
            </SelectItem>

          </SelectContent>

        </Select>

      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">

        <DataTable
          columns={columns}
          data={applications}
          pageCount={pageCount}
          page={page}
          onPageChange={handlePageChange}
          totalItems={total}
        />

      </div>

    </div>
  )
}