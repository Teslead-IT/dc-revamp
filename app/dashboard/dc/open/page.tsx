"use client"

import { DataTable, type Column } from "@/components/dashboard/data-table"
import { getDCByStatus, type DeliveryChallan } from "@/lib/mock-data"

export default function OpenDCPage() {
  const data = getDCByStatus("open")

  const columns: Column<DeliveryChallan>[] = [
    { key: "dcNumber", label: "DC No" },
    { key: "dcDate", label: "DC Date" },
    { key: "customerName", label: "Supplier Name" },
    { key: "totalItems", label: "Total Items" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "process", label: "Process" },
    { key: "vehicleNo", label: "Vehicle No" },
    { key: "projectName", label: "Project Name" },
    { key: "createdBy", label: "Created By" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Open DC List</h1>

      <DataTable data={data} columns={columns} viewHref={(item) => `/dashboard/dc/view/${item.id}`} />
    </div>
  )
}
