"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, User, FileText, Package, Plus } from "lucide-react"

interface ItemRow {
  id: number
  itemName: string
  description: string
  projectName: string
  projectIncharge: string
  quantity: string
  uom: string
  weightPerUnit: string
  totalWeight: string
  sqftPerUnit: string
  totalSqft: string
  rate: string
  remarks: string
}

export default function NewDCPage() {
  const router = useRouter()
  const [enableWeight, setEnableWeight] = useState(true)
  const [enableSqft, setEnableSqft] = useState(true)
  const [items, setItems] = useState<ItemRow[]>([
    {
      id: 1,
      itemName: "",
      description: "",
      projectName: "",
      projectIncharge: "",
      quantity: "",
      uom: "",
      weightPerUnit: "",
      totalWeight: "",
      sqftPerUnit: "",
      totalSqft: "",
      rate: "",
      remarks: "",
    },
  ])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        itemName: "",
        description: "",
        projectName: "",
        projectIncharge: "",
        quantity: "",
        uom: "",
        weightPerUnit: "",
        totalWeight: "",
        sqftPerUnit: "",
        totalSqft: "",
        rate: "",
        remarks: "",
      },
    ])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof ItemRow, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/dc/draft" className="text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">DRAFT DELIVERY CHALLAN</h1>
      </div>

      <form className="space-y-6">
        {/* Supplier Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-indigo-600" />
              Supplier Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label>
                  Supplier Name <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Select or type supplier name" />
              </div>
              <div className="space-y-2">
                <Label>
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Address 1" />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2</Label>
                <Input placeholder="Address 2" />
              </div>
              <div className="space-y-2">
                <Label>
                  State <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  City <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="coimbatore">Coimbatore</SelectItem>
                    <SelectItem value="madurai">Madurai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Pincode <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Pincode" />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input placeholder="GSTIN" />
              </div>
              <div className="space-y-2">
                <Label>
                  State Code <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Code" className="bg-slate-100" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DC Details */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-indigo-600" />
              DC Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>
                  DC Type <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select DC Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spm">SPM</SelectItem>
                    <SelectItem value="valve">VALVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  DC Date <span className="text-red-500">*</span>
                </Label>
                <Input type="date" defaultValue="2025-12-06" />
              </div>
              <div className="space-y-2">
                <Label>
                  Process <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Process" />
              </div>
              <div className="space-y-2">
                <Label>Vehicle No</Label>
                <Input placeholder="Vehicle text" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-indigo-600" />
              Items Details
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enableWeight"
                  checked={enableWeight}
                  onCheckedChange={(checked) => setEnableWeight(checked as boolean)}
                />
                <Label htmlFor="enableWeight" className="text-sm">
                  Enable Weight
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enableSqft"
                  checked={enableSqft}
                  onCheckedChange={(checked) => setEnableSqft(checked as boolean)}
                />
                <Label htmlFor="enableSqft" className="text-sm">
                  Enable Square Feet
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="table-responsive">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-slate-600">
                    <th className="px-2 py-2">S.NO</th>
                    <th className="px-2 py-2">Item Name</th>
                    <th className="px-2 py-2">Description</th>
                    <th className="px-2 py-2">Project Name</th>
                    <th className="px-2 py-2">Project Incharge</th>
                    <th className="px-2 py-2">Quantity</th>
                    <th className="px-2 py-2">UOM</th>
                    {enableWeight && (
                      <>
                        <th className="px-2 py-2">Weight/Unit</th>
                        <th className="px-2 py-2">Total Wt</th>
                      </>
                    )}
                    {enableSqft && (
                      <>
                        <th className="px-2 py-2">SqFt/Unit</th>
                        <th className="px-2 py-2">Total SqFt</th>
                      </>
                    )}
                    <th className="px-2 py-2">Rate</th>
                    <th className="px-2 py-2">Remarks</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-2 py-2 text-center">{index + 1}</td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="Item Name"
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                          className="h-8 min-w-[100px]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="h-8 min-w-[100px]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="Project"
                          value={item.projectName}
                          onChange={(e) => updateItem(item.id, "projectName", e.target.value)}
                          className="h-8 min-w-[80px]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="Incharge"
                          value={item.projectIncharge}
                          onChange={(e) => updateItem(item.id, "projectIncharge", e.target.value)}
                          className="h-8 min-w-[80px]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                          className="h-8 w-16"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="UOM"
                          value={item.uom}
                          onChange={(e) => updateItem(item.id, "uom", e.target.value)}
                          className="h-8 w-16"
                        />
                      </td>
                      {enableWeight && (
                        <>
                          <td className="px-2 py-2">
                            <Input
                              value={item.weightPerUnit}
                              onChange={(e) => updateItem(item.id, "weightPerUnit", e.target.value)}
                              className="h-8 w-16 bg-teal-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              value={item.totalWeight}
                              onChange={(e) => updateItem(item.id, "totalWeight", e.target.value)}
                              className="h-8 w-16 bg-teal-50"
                            />
                          </td>
                        </>
                      )}
                      {enableSqft && (
                        <>
                          <td className="px-2 py-2">
                            <Input
                              value={item.sqftPerUnit}
                              onChange={(e) => updateItem(item.id, "sqftPerUnit", e.target.value)}
                              className="h-8 w-16 bg-teal-50"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              value={item.totalSqft}
                              onChange={(e) => updateItem(item.id, "totalSqft", e.target.value)}
                              className="h-8 w-16 bg-teal-50"
                            />
                          </td>
                        </>
                      )}
                      <td className="px-2 py-2">
                        <Input
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                          className="h-8 w-16 bg-teal-50"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          placeholder="Remarks"
                          value={item.remarks}
                          onChange={(e) => updateItem(item.id, "remarks", e.target.value)}
                          className="h-8 min-w-[80px]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button type="button" onClick={addItem} className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Notes or instructions" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            Draft
          </Button>
          <Button type="button" variant="destructive">
            Clear
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </form>
    </div>
  )
}
