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
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { updateReportStatusAction } from './actions'

interface Report {
  id: string
  reporter_id: string
  reported_item_type: string
  reported_item_id: string
  reason: string
  description: string | null
  status: string
  moderator_notes: string | null
  resolved_at: string | null
  created_at: string
  user_profiles: {
    full_name: string | null
    email: string | null
  } | null
}

interface ModerationTableProps {
  reports: Report[]
  total: number
  page: number
  pageCount: number
  currentFilters: {
    status?: string
    itemType?: string
  }
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  reviewed: 'outline',
  resolved: 'default',
  dismissed: 'destructive',
}

export function ModerationTable({
  reports,
  total,
  page,
  pageCount,
  currentFilters,
}: ModerationTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilters = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/dashboard/moderation?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard/moderation?${params.toString()}`)
  }

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: 'user_profiles.full_name',
      header: 'Reporter',
      cell: ({ row }) => {
        const report = row.original
        return (
          <div className="space-y-1">
            <p className="font-medium">{report.user_profiles?.full_name || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">{report.user_profiles?.email}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'reported_item_type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.reported_item_type}</Badge>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-sm">{row.original.reason}</p>
          {row.original.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={statusColors[status] || 'secondary'}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Reported',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const report = row.original
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
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateReportStatusAction(report.id, 'reviewed')
                    router.refresh()
                  })
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                Mark Reviewed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateReportStatusAction(report.id, 'resolved')
                    router.refresh()
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Resolve
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() =>
                  startTransition(async () => {
                    await updateReportStatusAction(report.id, 'dismissed')
                    router.refresh()
                  })
                }
              >
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss
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
        <Select
          value={currentFilters.status || 'all'}
          onValueChange={(value) => updateFilters('status', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.itemType || 'all'}
          onValueChange={(value) => updateFilters('itemType', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Item Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="job">Job</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="review">Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={reports}
        pageCount={pageCount}
        page={page}
        onPageChange={handlePageChange}
        totalItems={total}
      />
    </div>
  )
}
