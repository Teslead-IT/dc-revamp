"use client"

import Link from "next/link"
import { DataTable, type Column } from "@/components/dashboard/data-table"
import { getDCByStatus, type DeliveryChallan } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export default function DraftDCPage() {
  const data = getDCByStatus("draft")

  const columns: Column<DeliveryChallan>[] = [
    { key: "id", label: "Draft ID" },
    { key: "customerName", label: "Party Name" },
    { key: "process", label: "Process" },
    { key: "totalItems", label: "Total Items" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "dcType", label: "DC Type" },
    { key: "vehicleNo", label: "Vehicle No" },
    { key: "projectName", label: "Project Name" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Draft DC List</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          variant="outline"
          className="border-slate-800 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link href="/dashboard/dc/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Draft
          </Link>
        </Button>
      </div>

      <DataTable data={data} columns={columns} viewHref={(item) => `/dashboard/dc/view/${item.id}`} />
    </div>
  )
}
