'use client'

import { ColumnDef } from '@tanstack/react-table'
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
import { MoreHorizontal, Eye, Star, StarOff, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { updateJobStatusAction, toggleJobPremiumAction, toggleJobUrgentAction } from './actions'

interface Job {
  id: string
  job_title: string
  status: string
  applications_count: number
  views_count: number
  is_premium: boolean
  is_urgent: boolean
  district: string
  job_category: string | null
  salary_min: number
  salary_max: number
  created_at: string
  companies: {
    id: string
    name: string
    logo_url: string | null
    is_verified: boolean
  }
}

interface JobsTableProps {
  jobs: Job[]
  total: number
  page: number
  pageCount: number
  categories: { id: string; category_name: string }[]
  districts: { id: string; district_name: string }[]
  currentFilters: {
    status?: string
    search?: string
    district?: string
    category?: string
  }
}

export function JobsTable({
  jobs,
  total,
  page,
  pageCount,
  categories,
  districts,
  currentFilters,
}: JobsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentFilters.search || '')

  const updateFilters = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/dashboard/jobs?${params.toString()}`)
  }

  const handleSearch = () => {
    updateFilters('search', search || undefined)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard/jobs?${params.toString()}`)
  }

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: 'job_title',
      header: 'Job Title',
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/jobs/${job.id}`}
                className="font-medium hover:underline"
              >
                {job.job_title}
              </Link>
              {job.is_premium && (
                <Badge variant="default" className="bg-amber-500 text-xs">
                  Premium
                </Badge>
              )}
              {job.is_urgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {job.companies.name}
              {job.companies.is_verified && (
                <CheckCircle className="ml-1 inline h-3 w-3 text-blue-500" />
              )}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'district',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.district}</span>
      ),
    },
    {
      accessorKey: 'applications_count',
      header: 'Applications',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.original.applications_count}</span>
          <span className="text-xs text-muted-foreground block">
            {row.original.views_count} views
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'salary_min',
      header: 'Salary',
      cell: ({ row }) => {
        const min = row.original.salary_min
        const max = row.original.salary_max
        return (
          <span className="text-sm">
            {min.toLocaleString('en-IN')} - {max.toLocaleString('en-IN')}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === 'active'
                ? 'default'
                : status === 'pending'
                ? 'secondary'
                : status === 'paused'
                ? 'outline'
                : 'destructive'
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Posted',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const job = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/jobs/${job.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {job.status !== 'active' && (
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(async () => {
                      await updateJobStatusAction(job.id, 'active')
                      router.refresh()
                    })
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
              )}
              {job.status === 'active' && (
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(async () => {
                      await updateJobStatusAction(job.id, 'paused')
                      router.refresh()
                    })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Pause
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await toggleJobPremiumAction(job.id, !job.is_premium)
                    router.refresh()
                  })
                }
              >
                {job.is_premium ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    Remove Premium
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Make Premium
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await toggleJobUrgentAction(job.id, !job.is_urgent)
                    router.refresh()
                  })
                }
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {job.is_urgent ? 'Remove Urgent' : 'Mark Urgent'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() =>
                  startTransition(async () => {
                    await updateJobStatusAction(job.id, 'closed')
                    router.refresh()
                  })
                }
              >
                <XCircle className="mr-2 h-4 w-4" />
                Close Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-64"
          />
          <Button variant="secondary" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={currentFilters.status || 'all'}
          onValueChange={(value) => updateFilters('status', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.district || 'all'}
          onValueChange={(value) => updateFilters('district', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.district_name}>
                {district.district_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.category || 'all'}
          onValueChange={(value) => updateFilters('category', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.category_name}>
                {cat.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={jobs}
        pageCount={pageCount}
        page={page}
        onPageChange={handlePageChange}
        totalItems={total}
      />
    </div>
  )
}
