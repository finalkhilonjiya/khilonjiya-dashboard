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
import { MoreHorizontal, Eye, Clock, Hammer, CheckCircle, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { updateConstructionStatusAction } from './actions'

interface ConstructionRequest {
  id: string
  service_type: string
  name: string
  phone: string
  email: string | null
  project_address: string
  project_type: string | null
  budget_range: string | null
  status: string
  quote_amount: number | null
  created_at: string
}

interface ConstructionTableProps {
  requests: ConstructionRequest[]
  total: number
  page: number
  pageCount: number
  serviceTypes: string[]
  currentFilters: {
    status?: string
    serviceType?: string
    search?: string
  }
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  in_progress: 'default',
  completed: 'default',
  cancelled: 'destructive',
}

export function ConstructionTable({
  requests,
  total,
  page,
  pageCount,
  serviceTypes,
  currentFilters,
}: ConstructionTableProps) {
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
    router.push(`/dashboard/construction?${params.toString()}`)
  }

  const handleSearch = () => {
    updateFilters('search', search || undefined)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard/construction?${params.toString()}`)
  }

  const columns: ColumnDef<ConstructionRequest>[] = [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => {
        const req = row.original
        return (
          <div className="space-y-1">
            <Link
              href={`/dashboard/construction/${req.id}`}
              className="font-medium hover:underline"
            >
              {req.name}
            </Link>
            <p className="text-xs text-muted-foreground">{req.phone}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'service_type',
      header: 'Service Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.service_type}</Badge>
      ),
    },
    {
      accessorKey: 'project_address',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-sm line-clamp-2">{row.original.project_address}</span>
      ),
    },
    {
      accessorKey: 'budget_range',
      header: 'Budget',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.budget_range || 'Not specified'}</span>
      ),
    },
    {
      accessorKey: 'quote_amount',
      header: 'Quote',
      cell: ({ row }) => {
        const amount = row.original.quote_amount
        return amount ? (
          <span className="font-medium">
            {amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
        ) : (
          <span className="text-muted-foreground">Not quoted</span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={statusColors[status] || 'secondary'}>
            {status.replace('_', ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const req = row.original
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
                <Link href={`/dashboard/construction/${req.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateConstructionStatusAction(req.id, 'in_progress')
                    router.refresh()
                  })
                }
              >
                <Hammer className="mr-2 h-4 w-4" />
                Mark In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateConstructionStatusAction(req.id, 'completed')
                    router.refresh()
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => {
                    await updateConstructionStatusAction(req.id, 'pending')
                    router.refresh()
                  })
                }
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark Pending
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
            placeholder="Search by name, phone, address..."
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
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.serviceType || 'all'}
          onValueChange={(value) => updateFilters('serviceType', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {serviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={requests}
        pageCount={pageCount}
        page={page}
        onPageChange={handlePageChange}
        totalItems={total}
      />
    </div>
  )
}
