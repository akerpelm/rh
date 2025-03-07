'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'day', desc: false }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: rowsPerPage,
      },
    },
  })

  console.log(data)
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4 py-4">
        <Input
          placeholder="Filter club names..."
          value={(table.getColumn('clubName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('clubName')?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />

        {/* Update Borough filter to use meeting location's borough */}
        <Select
          value={(table.getColumn('location')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('location')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All boroughs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All boroughs</SelectItem>
            {Array.from(
              new Set(
                data
                  .map((item: any) => item.meetingLocation?.neighborhood?.borough?.name)
                  .filter(Boolean),
              ),
            ).map((borough) => (
              <SelectItem key={borough} value={borough}>
                {borough}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Remove neighborhood filter */}

        <Select
          value={(table.getColumn('runType')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('runType')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All run types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="easy">Easy Run</SelectItem>
            <SelectItem value="long">Long Run</SelectItem>
            <SelectItem value="workout">Workout</SelectItem>
            <SelectItem value="social">Social Run</SelectItem>
            <SelectItem value="track">Track</SelectItem>
            <SelectItem value="hills">Hills</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="soon">Starting Soon</SelectItem>
            <SelectItem value="upcoming">Today</SelectItem>
            <SelectItem value="inactive">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                View <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No scheduled runs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center gap-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
              setRowsPerPage(Number(value))
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Runs per page</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
