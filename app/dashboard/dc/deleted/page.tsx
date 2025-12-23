"use client"

import { DataTable, type Column } from "@/components/dashboard/data-table"
import { getDCByStatus, type DeliveryChallan } from "@/lib/mock-data"

export default function DeletedDCPage() {
  const data = getDCByStatus("deleted")

  const columns: Column<DeliveryChallan>[] = [
    { key: "dcNumber", label: "DC Number" },
    { key: "customerName", label: "Customer Name" },
    { key: "itemNames", label: "Item Name", className: "max-w-[300px]" },
    { key: "dcDate", label: "DC Date" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Deleted Delivery Challans</h1>

      <DataTable data={data} columns={columns} viewHref={(item) => `/dashboard/dc/view/${item.id}`} />
    </div>
  )
}
