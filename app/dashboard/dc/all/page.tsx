"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DataTable, type Column } from "@/components/dashboard/data-table"
import { ZohoAlert } from "@/components/ui/zoho-alert"
import { CustomToast } from "@/components/ui/custom-toast"
import { mockDCData, type DeliveryChallan } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"

const statusColors: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700 border border-amber-200",
  open: "bg-blue-100 text-blue-700 border border-blue-200",
  partial: "bg-orange-100 text-orange-700 border border-orange-200",
  closed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 border border-slate-200",
  deleted: "bg-red-100 text-red-700 border border-red-200",
}

const statusFilters = [
  { value: "all", label: "ALL", color: "bg-indigo-600 hover:bg-indigo-700" },
  { value: "draft", label: "Draft", color: "bg-amber-500 hover:bg-amber-600" },
  { value: "partial", label: "Partial", color: "bg-orange-500 hover:bg-orange-600" },
  { value: "closed", label: "Close", color: "bg-emerald-500 hover:bg-emerald-600" },
  { value: "deleted", label: "Delete", color: "bg-red-500 hover:bg-red-600" },
  { value: "cancelled", label: "Cancel", color: "bg-slate-500 hover:bg-slate-600" },
]

export default function AllDCPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [dropdownFilter, setDropdownFilter] = useState("All")
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedDC, setSelectedDC] = useState<DeliveryChallan | null>(null)

  const filteredData = statusFilter === "all" ? mockDCData : mockDCData.filter((dc) => dc.status === statusFilter)

  const handleDeleteClick = (dc: DeliveryChallan) => {
    setSelectedDC(dc)
    setAlertOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedDC) {
      // Show loading toast
      const toastId = toast.custom((t) => (
        <CustomToast type="info" title="Deleting..." description={`Deleting DC ${selectedDC.dcNumber}`} />
      ))

      // Simulate API call
      setTimeout(() => {
        toast.dismiss(toastId)
        
        // Show success toast
        toast.custom((t) => (
          <div onClick={() => toast.dismiss(t)} className="cursor-pointer">
            <CustomToast
              type="success"
              title="Success!"
              description={`DC ${selectedDC.dcNumber} has been deleted successfully`}
              onDismiss={() => toast.dismiss(t)}
            />
          </div>
        ))
        
        setAlertOpen(false)
        setSelectedDC(null)
      }, 1500)
    }
  }

  const columns: Column<DeliveryChallan>[] = [
    { key: "dcNumber", label: "DC Number" },
    { key: "itemNames", label: "Item Name(s)", className: "max-w-[200px] truncate" },
    { key: "customerName", label: "Customer Name" },
    { key: "totalDispatchQty", label: "Total Dispatch Quantity" },
    { key: "totalReceivedQty", label: "Total Received Quantity (Sum)" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span className={cn("rounded-md px-2.5 py-1 text-xs font-medium uppercase", statusColors[item.status])}>
          {item.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleDeleteClick(item)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">All DC List</h1>

        {/* Demo button to show Zoho alert */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
          onClick={() => {
            setSelectedDC(mockDCData[0] || null)
            setAlertOpen(true)
          }}
        >
          <Trash2 className="h-4 w-4" />
          Demo Delete Alert
        </Button>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              size="sm"
              className={cn(
                "text-white shadow-sm transition-all",
                filter.color,
                statusFilter === filter.value
                  ? "ring-2 ring-offset-2 ring-offset-slate-100"
                  : "opacity-80 hover:opacity-100",
              )}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-slate-600">Filter by Status:</span>
          <Select value={dropdownFilter} onValueChange={setDropdownFilter}>
            <SelectTrigger className="h-9 w-32 border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={filteredData} columns={columns} viewHref={(item) => `/dashboard/dc/view/${item.id}`} />

      {/* Zoho-style Alert Dialog */}
      <ZohoAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        // title={`Trash DC ${selectedDC?.dcNumber}?`}
        title="Delete DC ?"
        description="This action cannot be undone. This will permanently delete the DC and remove the data from our servers."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
