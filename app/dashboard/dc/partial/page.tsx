"use client"

import { DataTable, type Column } from "@/components/dashboard/data-table"
import { getDCByStatus, type DeliveryChallan } from "@/lib/mock-data"

export default function PartialDCPage() {
  const data = getDCByStatus("partial")

  const columns: Column<DeliveryChallan>[] = [
    { key: "dcNumber", label: "DC NUMBER" },
    { key: "customerName", label: "CUSTOMER NAME" },
    { key: "itemNames", label: "ITEM NAME", className: "max-w-[300px]" },
    { key: "dcDate", label: "DC DATE" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Partial Delivery Challans</h1>

      <DataTable data={data} columns={columns} headerBg viewHref={(item) => `/dashboard/dc/view/${item.id}`} />
    </div>
  )
}
