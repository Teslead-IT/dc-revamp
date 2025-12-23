"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, User, FileText, Package, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

export function NewDCSheet() {
    const [open, setOpen] = useState(false)
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="gap-2 bg-brand text-white hover:bg-brand/90 shadow-md transition-all">
                    <Plus className="h-4 w-4" />
                    New DC
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-[95vw] sm:max-w-[50vw] bg-[#0F172A] border-l border-slate-800 p-0 shadow-2xl flex flex-col">
                <SheetHeader className="px-6 py-4 border-b border-slate-800 bg-[#0F172A] flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-xl font-bold text-slate-100">Create New Delivery Challan</SheetTitle>
                            <SheetDescription className="text-slate-400 mt-1">
                                Fill in the details to create a new DC. Use the sections below to organize your data.
                            </SheetDescription>
                        </div>
                        {/* Default close is usually top-right, but we can have explicit actions if we want */}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-[#0B1120]">
                    <div className="space-y-8 max-w-[1100px] mx-auto">

                        {/* Supplier Info Section */}
                        <section className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                <User className="h-5 w-5" />
                                Supplier Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#1e293b]/30 p-6 rounded-xl border border-slate-800/60">
                                <div className="space-y-2">
                                    <Label className="text-slate-100">Supplier Name <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Search supplier..." className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">Address Line 1 <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Door No, Street" className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">Address Line 2</Label>
                                    <Input placeholder="Area, Landmark" className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">State <span className="text-red-500">*</span></Label>
                                    <Select>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 data-[placeholder]:text-slate-600">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                            <SelectItem value="karnataka">Karnataka</SelectItem>
                                            <SelectItem value="kerala">Kerala</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">City <span className="text-red-500">*</span></Label>
                                    <Select>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 data-[placeholder]:text-slate-600">
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectItem value="chennai">Chennai</SelectItem>
                                            <SelectItem value="coimbatore">Coimbatore</SelectItem>
                                            <SelectItem value="madurai">Madurai</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">Pincode</Label>
                                    <Input placeholder="600000" className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                            </div>
                        </section>

                        {/* DC Details Section */}
                        <section className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                <FileText className="h-5 w-5" />
                                DC Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1e293b]/30 p-6 rounded-xl border border-slate-800/60">
                                <div className="space-y-2">
                                    <Label className="text-slate-100">DC Type <span className="text-red-500">*</span></Label>
                                    <Select>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 data-[placeholder]:text-slate-600">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectItem value="spm">SPM</SelectItem>
                                            <SelectItem value="valve">VALVE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">DC Date <span className="text-red-500">*</span></Label>
                                    <Input type="date" className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">Process</Label>
                                    <Input placeholder="e.g. Machining" className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-100">Vehicle No</Label>
                                    <Input placeholder="TN-XX-XXXX" className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand" />
                                </div>
                            </div>
                        </section>

                        {/* Line Items Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <Package className="h-5 w-5" />
                                    Line Items
                                </h3>
                                <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="enableWeight"
                                            checked={enableWeight}
                                            onCheckedChange={(checked) => setEnableWeight(checked as boolean)}
                                            className="border-slate-500 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                                        />
                                        <Label htmlFor="enableWeight" className="text-sm text-slate-300 cursor-pointer">Weight</Label>
                                    </div>
                                    <div className="w-px h-4 bg-slate-700"></div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="enableSqft"
                                            checked={enableSqft}
                                            onCheckedChange={(checked) => setEnableSqft(checked as boolean)}
                                            className="border-slate-500 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                                        />
                                        <Label htmlFor="enableSqft" className="text-sm text-slate-300 cursor-pointer">Sq.Ft</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#1e293b]/20">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full min-w-[800px] text-sm text-left">
                                        <thead className="bg-slate-900/80 text-slate-400 font-medium uppercase text-xs tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3 w-12 text-center">#</th>
                                                <th className="px-3 py-3 w-40">Item Name</th>
                                                <th className="px-3 py-3 w-40">Description</th>
                                                <th className="px-3 py-3 w-32">Project</th>
                                                <th className="px-3 py-3 w-24">Qty</th>
                                                <th className="px-3 py-3 w-24">UOM</th>
                                                {enableWeight && (
                                                    <>
                                                        <th className="px-3 py-3 w-28">Wt/Unit</th>
                                                        <th className="px-3 py-3 w-28">Total Wt</th>
                                                    </>
                                                )}
                                                {enableSqft && (
                                                    <>
                                                        <th className="px-3 py-3 w-28">SqFt/Unit</th>
                                                        <th className="px-3 py-3 w-28">Total SqFt</th>
                                                    </>
                                                )}
                                                <th className="px-3 py-3 w-32">Remarks</th>
                                                <th className="px-3 py-3 w-16 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {items.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            value={item.itemName}
                                                            onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                                                            className="h-9 bg-transparent border-transparent hover:border-slate-700 focus:border-brand focus:bg-slate-900/50 text-slate-200"
                                                            placeholder="Item Name"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            value={item.description}
                                                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                                            className="h-9 bg-transparent border-transparent hover:border-slate-700 focus:border-brand focus:bg-slate-900/50 text-slate-200"
                                                            placeholder="Desc"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            value={item.projectName}
                                                            onChange={(e) => updateItem(item.id, "projectName", e.target.value)}
                                                            className="h-9 bg-transparent border-transparent hover:border-slate-700 focus:border-brand focus:bg-slate-900/50 text-slate-200"
                                                            placeholder="Project"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                                                            className="h-9 bg-transparent border-transparent hover:border-slate-700 focus:border-brand focus:bg-slate-900/50 text-slate-200 font-medium"
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            value={item.uom}
                                                            onChange={(e) => updateItem(item.id, "uom", e.target.value)}
                                                            className="h-9 bg-transparent border-transparent hover:border-slate-700 focus:border-brand focus:bg-slate-900/50 text-slate-200"
                                                            placeholder="Nos"
                                                        />
                                                    </td>
                                                    {enableWeight && (
                                                        <>
                                                            <td className="px-2 py-2">
                                                                <Input
                                                                    value={item.weightPerUnit}
                                                                    onChange={(e) => updateItem(item.id, "weightPerUnit", e.target.value)}
                                                                    className="h-9 bg-teal-500/10 border-transparent hover:border-teal-500/50 focus:border-teal-500 text-teal-300 placeholder:text-teal-700/50"
                                                                    placeholder="0.00"
                                                                />
                                                            </td>
                                                            <td className="px-2 py-2">
                                                                <Input
                                                                    value={item.totalWeight}
                                                                    onChange={(e) => updateItem(item.id, "totalWeight", e.target.value)}
                                                                    className="h-9 bg-teal-500/10 border-transparent hover:border-teal-500/50 focus:border-teal-500 text-teal-300 placeholder:text-teal-700/50 font-medium"
                                                                    placeholder="0.00"
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
                                                                    className="h-9 bg-blue-500/10 border-transparent hover:border-blue-500/50 focus:border-blue-500 text-blue-300 placeholder:text-blue-700/50"
                                                                    placeholder="0.00"
                                                                />
                                                            </td>
                                                            <td className="px-2 py-2">
                                                                <Input
                                                                    value={item.totalSqft}
                                                                    onChange={(e) => updateItem(item.id, "totalSqft", e.target.value)}
                                                                    className="h-9 bg-blue-500/10 border-transparent hover:border-blue-500/50 focus:border-blue-500 text-blue-300 placeholder:text-blue-700/50 font-medium"
                                                                    placeholder="0.00"
                                                                />
                                                            </td>
                                                        </>
                                                    )}
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            value={item.remarks}
                                                            onChange={(e) => updateItem(item.id, "remarks", e.target.value)}
                                                            className="h-9 bg-transparent border-transparent hover:border-slate-700 focus:border-brand focus:bg-slate-900/50 text-slate-200"
                                                            placeholder="..."
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors opacity-50 group-hover:opacity-100"
                                                            disabled={items.length === 1}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-3 bg-slate-900 border-t border-slate-800">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={addItem}
                                        className="text-brand-highlight hover:text-white hover:bg-brand/20 gap-2 h-9"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add New Row
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Additional Info Section */}
                        <section className="space-y-4 pb-4">
                            <h3 className="text-lg font-semibold text-white">Notes & Terms</h3>
                            <Textarea
                                placeholder="Enter any specific notes, terms or delivery instructions..."
                                className="min-h-[100px] bg-[#1e293b]/30 border-slate-800 text-slate-200 focus:border-brand resize-none"
                            />
                        </section>
                    </div>
                </div>

                <SheetFooter className="px-6 py-4 border-t border-slate-800 bg-[#0F172A] flex-shrink-0 flex flex-row items-center justify-end gap-3">
                    <SheetClose asChild>
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
                            Cancel
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button className="bg-slate-700 text-slate-200 hover:bg-slate-600">
                            Save as Draft
                        </Button>
                    </SheetClose>
                    <Button type="submit" className="bg-brand text-white hover:bg-brand/90 px-8 shadow-lg shadow-brand/25">
                        Create DC
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
