"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getDCById } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, XCircle, Trash2, RefreshCw, LinkIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock item details
const mockItems = [
  { sNo: 1, itemName: "TL-ITEM2", quantity: 4, uom: "LITER", projectName: "spm", projectIncharge: "pandi" },
  { sNo: 2, itemName: "TL-ITEM3", quantity: 4, uom: "PIECE", projectName: "spm", projectIncharge: "arun" },
  { sNo: 3, itemName: "TL-ITEM1", quantity: 5, uom: "KG", projectName: "spm", projectIncharge: "pandi" },
  { sNo: 4, itemName: "tap", quantity: 7, uom: "PIECE", projectName: "spm", projectIncharge: "vicky" },
  { sNo: 5, itemName: "Item 1", quantity: 7, uom: "NOS", projectName: "spm", projectIncharge: "dharani" },
  { sNo: 6, itemName: "Item 1", quantity: 6, uom: "SET", projectName: "spm", projectIncharge: "kiishore" },
  { sNo: 7, itemName: "Item 1", quantity: 4, uom: "METER", projectName: "spm", projectIncharge: "pandi" },
  { sNo: 8, itemName: "valve", quantity: 6, uom: "SET", projectName: "spm", projectIncharge: "vicky" },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-amber-500", text: "text-white" },
  open: { bg: "bg-slate-800", text: "text-white" },
  partial: { bg: "bg-orange-500", text: "text-white" },
  closed: { bg: "bg-green-500", text: "text-white" },
  cancelled: { bg: "bg-slate-500", text: "text-white" },
}

export default function ViewDCPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const dc = getDCById(id)

  if (!dc) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">Delivery Challan not found</p>
      </div>
    )
  }

  const statusConfig = statusColors[dc.status] || statusColors.draft

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">
          View {dc.status.charAt(0).toUpperCase() + dc.status.slice(1)} Delivery Challan
        </h1>
      </div>

      {/* DC Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left - DC Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">DC Number</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">{dc.dcNumber}</h2>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-medium capitalize",
                      statusConfig.bg,
                      statusConfig.text,
                    )}
                  >
                    {dc.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete DC
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update DC
                </Button>
                <Button variant="outline">Generate Report</Button>
                <Button variant="link" className="text-indigo-600">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Generate DC
                </Button>
              </div>
            </div>

            {/* Right - Supplier Info */}
            <div className="text-right">
              <Link href="#" className="flex items-center justify-end gap-1 text-sm text-indigo-600 hover:underline">
                <User className="h-4 w-4" />
                Supplier Details
              </Link>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{dc.customerName}</h3>
              <p className="text-sm text-slate-500">33AAPFD7130F1Z7</p>
              <p className="mt-2 text-sm text-slate-500">SIDCO INDUSTRIAL ESTATE, EDIYARPALAYAM, VELLALORE</p>
              <p className="text-sm text-slate-500">Bhavnagar, Gujarat</p>
              <p className="text-sm text-slate-500">641014</p>
            </div>
          </div>

          {/* DC Meta */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
            <div className="border-l-4 border-indigo-600 pl-3">
              <p className="text-sm text-slate-500">DC Type</p>
              <p className="font-semibold text-slate-900">{dc.dcType || "SPM"}</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-3">
              <p className="text-sm text-slate-500">DC Date</p>
              <p className="font-semibold text-slate-900">{dc.dcDate}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="text-sm text-slate-500">Process</p>
              <p className="font-semibold text-slate-900">{dc.process || "coating"}</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-sm text-slate-500">Vehicle No</p>
              <p className="font-semibold text-slate-900">{dc.vehicleNo || "tn31 bt 1286"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Item Details</CardTitle>
          <Link href="#" className="text-sm text-indigo-600 hover:underline">
            View All Items
          </Link>
        </CardHeader>
        <CardContent>
          <div className="table-responsive">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b bg-slate-100 text-left text-sm text-slate-600">
                  <th className="px-4 py-3">S No</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">UOM</th>
                  <th className="px-4 py-3">Project Name</th>
                  <th className="px-4 py-3">Project Incharge</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockItems.map((item) => (
                  <tr key={item.sNo} className="border-b border-red-200 bg-red-50/30">
                    <td className="px-4 py-3 text-sm text-slate-700">{item.sNo}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.itemName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.uom}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.projectName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.projectIncharge}</td>
                    <td className="px-4 py-3">
                      <Link href="#" className="text-sm text-indigo-600 hover:underline">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="mt-6 rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-medium text-slate-700">Notes</p>
            <p className="mt-1 text-sm text-slate-500">-</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
