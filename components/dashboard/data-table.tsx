'use client'

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useState } from 'react'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download,
} from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  pageCount?: number
  page?: number
  onPageChange?: (page: number) => void
  totalItems?: number
  showExport?: boolean
  onExport?: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  pageCount,
  page = 1,
  onPageChange,
  totalItems,
  showExport = false,
  onExport,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] =
    useState<SortingState>([])

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([])

  const isServerPagination =
    pageCount !== undefined &&
    onPageChange !== undefined

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel:
      isServerPagination
        ? undefined
        : getPaginationRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    onSortingChange: setSorting,

    onColumnFiltersChange:
      setColumnFilters,

    state: {
      sorting,
      columnFilters,
    },

    manualPagination:
      isServerPagination,

    pageCount,
  })

  return (
    <div className="w-full space-y-4 overflow-hidden">

      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {searchKey && (
          <div className="relative w-full sm:max-w-sm">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder={searchPlaceholder}
              value={
                (table
                  .getColumn(searchKey)
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table
                  .getColumn(searchKey)
                  ?.setFilterValue(
                    event.target.value
                  )
              }
              className="pl-10"
            />

          </div>
        )}

        {showExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="w-full sm:w-auto"
          >

            <Download className="mr-2 h-4 w-4" />

            Export CSV

          </Button>
        )}

      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border">

        <Table className="min-w-[800px]">

          <TableHeader>

            {table
              .getHeaderGroups()
              .map((headerGroup) => (

                <TableRow key={headerGroup.id}>

                  {headerGroup.headers.map(
                    (header) => (

                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm"
                      >

                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef
                                .header,
                              header.getContext()
                            )}

                      </TableHead>
                    )
                  )}

                </TableRow>
              ))}

          </TableHeader>

          <TableBody>

            {table.getRowModel().rows?.length ? (

              table
                .getRowModel()
                .rows.map((row) => (

                  <TableRow
                    key={row.id}
                    data-state={
                      row.getIsSelected() &&
                      'selected'
                    }
                  >

                    {row
                      .getVisibleCells()
                      .map((cell) => (

                        <TableCell
                          key={cell.id}
                          className="px-3 py-3 text-xs sm:text-sm"
                        >

                          {flexRender(
                            cell.column.columnDef
                              .cell,
                            cell.getContext()
                          )}

                        </TableCell>
                      ))}

                  </TableRow>
                ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm"
                >
                  No results found.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">

          {totalItems !== undefined ? (
            <>
              Showing {data.length} of {totalItems} results
            </>
          ) : (
            <>
              {
                table
                  .getFilteredRowModel()
                  .rows.length
              }{' '}
              row(s)
            </>
          )}

        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2">

          {isServerPagination ? (
            <>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onPageChange?.(1)
                }
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onPageChange?.(
                    page - 1
                  )
                }
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="min-w-[90px] text-center text-xs sm:text-sm">
                Page {page} of {pageCount}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onPageChange?.(
                    page + 1
                  )
                }
                disabled={
                  page === pageCount
                }
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onPageChange?.(
                    pageCount || 1
                  )
                }
                disabled={
                  page === pageCount
                }
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>

            </>
          ) : (
            <>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  table.setPageIndex(0)
                }
                disabled={
                  !table.getCanPreviousPage()
                }
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  table.previousPage()
                }
                disabled={
                  !table.getCanPreviousPage()
                }
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="min-w-[90px] text-center text-xs sm:text-sm">
                Page{' '}
                {
                  table.getState()
                    .pagination
                    .pageIndex + 1
                }{' '}
                of {table.getPageCount()}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  table.nextPage()
                }
                disabled={
                  !table.getCanNextPage()
                }
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  table.setPageIndex(
                    table.getPageCount() - 1
                  )
                }
                disabled={
                  !table.getCanNextPage()
                }
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>

            </>
          )}

        </div>

      </div>

    </div>
  )
}