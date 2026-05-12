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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Eye, CheckCircle, XCircle, Search, Star } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { updateCompanyVerificationAction } from './actions'

interface Company {
  id: string
  name: string
  slug: string | null
  logo_url: string | null
  industry: string | null
  company_size: string | null
  headquarters_city: string | null
  headquarters_state: string | null
  rating: number | null
  total_reviews: number
  total_jobs: number
  is_verified: boolean
  created_at: string
  business_types_master: { type_name: string } | null
}

interface CompaniesTableProps {
  companies: Company[]
  total: number
  page: number
  pageCount: number
  industries: string[]
  currentFilters: {
    search?: string
    industry?: string
    verified?: string
  }
}

export function CompaniesTable({
  companies,
  total,
  page,
  pageCount,
  industries,
  currentFilters,
}: CompaniesTableProps) {
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
    router.push(`/dashboard/companies?${params.toString()}`)
  }

  const handleSearch = () => {
    updateFilters('search', search || undefined)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard/companies?${params.toString()}`)
  }

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'name',
      header: 'Company',
      cell: ({ row }) => {
        const company = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={company.logo_url || undefined} alt={company.name} />
              <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/companies/${company.id}`}
                  className="font-medium hover:underline"
                >
                  {company.name}
                </Link>
                {company.is_verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {company.industry || 'No industry'}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'headquarters_city',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.headquarters_city || 'N/A'}
          {row.original.headquarters_state && `, ${row.original.headquarters_state}`}
        </span>
      ),
    },
    {
      accessorKey: 'company_size',
      header: 'Size',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.company_size || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'total_jobs',
      header: 'Jobs',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.total_jobs}</span>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = row.original.rating
        return rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({row.original.total_reviews})
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No reviews</span>
        )
      },
    },
    {
      accessorKey: 'is_verified',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.is_verified ? 'default' : 'secondary'}>
          {row.original.is_verified ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const company = row.original
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
                <Link href={`/dashboard/companies/${company.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {company.is_verified ? (
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(async () => {
                      await updateCompanyVerificationAction(company.id, false)
                      router.refresh()
                    })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Revoke Verification
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(async () => {
                      await updateCompanyVerificationAction(company.id, true)
                      router.refresh()
                    })
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Company
                </DropdownMenuItem>
              )}
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
            placeholder="Search companies..."
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
          value={currentFilters.verified || 'all'}
          onValueChange={(value) => updateFilters('verified', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.industry || 'all'}
          onValueChange={(value) => updateFilters('industry', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={companies}
        pageCount={pageCount}
        page={page}
        onPageChange={handlePageChange}
        totalItems={total}
      />
    </div>
  )
}
