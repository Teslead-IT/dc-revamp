"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  viewHref?: (item: T) => string
  headerBg?: boolean
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  viewHref,
  headerBg = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const filteredData = data.filter((item) =>
    Object.values(item as object).some((val) => String(val).toLowerCase().includes(search.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)

  const startEntry = filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1
  const endEntry = Math.min(page * pageSize, filteredData.length)

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header - Search and Page Size */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
              setPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-20 border-slate-200 bg-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-500">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Search:</span>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder={searchPlaceholder}
            className="h-8 w-48 border-slate-200 bg-white text-sm lg:w-64"
          />
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div ref={tableContainerRef} className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className={cn("border-b", headerBg ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-700")}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide", col.className)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <span className="text-slate-400">⇅</span>
                  </div>
                </th>
              ))}
              {viewHref && (
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (viewHref ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500">No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={item.id || idx} className="transition-colors hover:bg-indigo-50/50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn("px-4 py-3 text-sm text-slate-700", col.className)}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  {viewHref && (
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={viewHref(item)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Zoho-style Footer with count and pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2">
        {/* Left side - can be empty or show info */}
        <div />

        {/* Right side - Zoho style pagination */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            Total Count: <span className="font-semibold">{filteredData.length}</span>
          </span>
          <div className="h-4 w-px bg-slate-300" />

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            {/* First page */}
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Previous page */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page indicator */}
            <span className="min-w-[60px] text-center text-sm text-slate-700">
              {startEntry}-{endEntry}
            </span>

            {/* Next page */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last page */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
