"use client"

import { useState, useEffect } from "react"
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
import { Plus, Trash2, User, FileText, Package, Loader2, Edit } from "lucide-react"
import { showToast as toast } from "@/lib/toast-service"
import { useCreateSupplier } from "@/hooks/use-suppliers"

// Import React Query hooks
import { useSearchSuppliers } from "@/hooks/use-suppliers"
import { useCreateDraftDC } from "@/hooks/use-draft-dc"
import { useCreateDraftDCItems } from "@/hooks/use-draft-dc-items"
import { useQueryClient } from "@tanstack/react-query"
import { AddItemsModal } from "./add-items-modal"
import { CreateSupplierModal } from "./create-supplier-modal"

import type { Supplier, DCType } from "@/lib/api-client"

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
    notes: string
}

export function NewDCSheet() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    // Supplier state
    const [supplierSearch, setSupplierSearch] = useState('')
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)
    const [showCreateSupplier, setShowCreateSupplier] = useState(false)

    // DC Details
    const [vehicleNo, setVehicleNo] = useState('')
    const [process, setProcess] = useState('')
    const [dcType, setDCType] = useState<DCType>('SPM')
    const [dcDate, setDCDate] = useState('')
    const [notes, setNotes] = useState('')

    // Items state
    const [enableWeight, setEnableWeight] = useState(false)
    const [enableSqft, setEnableSqft] = useState(false)
    const [showAddItemsModal, setShowAddItemsModal] = useState(false)
    const [items, setItems] = useState<ItemRow[]>([])

    // React Query hooks
    const { data: searchResults = [], isLoading: isSearching, error: searchError } = useSearchSuppliers(supplierSearch)
    const createSupplier = useCreateSupplier()
    const createDraftDC = useCreateDraftDC()
    const createDraftDCItems = useCreateDraftDCItems()

    // Debug logging
    useEffect(() => {
        console.log('Search state:', {
            supplierSearch,
            searchResults,
            isSearching,
            searchError,
            showSupplierDropdown
        })
    }, [supplierSearch, searchResults, isSearching, searchError, showSupplierDropdown])

    // Reset form when sheet closes
    useEffect(() => {
        if (!open) {
            setSupplierSearch('')
            setSelectedSupplier(null)
            setShowSupplierDropdown(false)
            setVehicleNo('')
            setProcess('')
            setDCType('SPM')
            setDCDate('')
            setNotes('')
            setEnableWeight(false)
            setEnableSqft(false)
            setItems([])
        }
    }, [open])

    const removeItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id))
    }

    const handleItemsConfirm = (updatedItems: ItemRow[]) => {
        // If items already exist, we're updating; otherwise adding
        setItems(updatedItems)
    }

    // Supplier handlers
    const handleSupplierSelect = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setSupplierSearch(supplier.partyName)
        setShowSupplierDropdown(false)
    }

    const handleSupplierSearchChange = (value: string) => {
        setSupplierSearch(value)
        setSelectedSupplier(null)
        // Only open dropdown when starting to type, don't close it during typing
        if (value.length >= 2 && !showSupplierDropdown) {
            setShowSupplierDropdown(true)
        } else if (value.length < 2) {
            setShowSupplierDropdown(false)
        }
    }

    const handleCreateNewSupplier = () => {
        setShowCreateSupplier(true)
        setShowSupplierDropdown(false)
    }

    // Save Draft
    const handleSaveDraft = async () => {
        if (!selectedSupplier) {
            toast.error('Please select a supplier')
            return
        }

        if (!vehicleNo || !process) {
            toast.error('Please fill vehicle number and process')
            return
        }

        const validItems = items.filter(i => i.itemName && i.description && i.quantity)
        if (validItems.length === 0) {
            toast.error('Please add at least one item')
            return
        }

        try {
            toast.info('Creating draft DC...')

            const totalQuantity = validItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)
            const totalRate = validItems.reduce((sum, item) => sum + (parseFloat(item.rate) || 0), 0)

            // Step 1: Create Draft DC
            const draftDCData = {
                partyId: selectedSupplier.partyId,
                vehicleNo,
                process,
                totalDispatchedQuantity: totalQuantity,
                totalRate: totalRate,
                showWeight: enableWeight,
                showSquareFeet: enableSqft,
                notes,
                updatedBy: '',
                dcType,
                dcDate: dcDate || new Date().toISOString(),
            }

            const createdDC = await createDraftDC.mutateAsync(draftDCData)

            // Step 2: Create Draft DC Items
            toast.info('Adding items...')

            const draftItems = validItems.map(item => ({
                itemName: item.itemName,
                itemDescription: item.description,
                uom: item.uom || 'KG',
                quantity: parseFloat(item.quantity) || 0,
                // Send 0 if weight is disabled
                weightPerUnit: enableWeight ? (parseFloat(item.weightPerUnit) || 0) : 0,
                totalWeight: enableWeight ? (parseFloat(item.totalWeight) || 0) : 0,
                ratePerEach: parseFloat(item.rate) || 0,
                // Send 0 if square feet is disabled
                squareFeetPerUnit: enableSqft ? (parseFloat(item.sqftPerUnit) || 0) : 0,
                totalSquareFeet: enableSqft ? (parseFloat(item.totalSqft) || 0) : 0,
                remarks: item.remarks || '',
                projectName: item.projectName || '',
                projectIncharge: item.projectIncharge || '',
                notes: item.notes || '',
            }))


            await createDraftDCItems.mutateAsync({
                draftId: createdDC.draftId || createdDC.id.toString(),
                partyId: selectedSupplier.partyId,
                items: draftItems,
            })

            toast.success('Draft DC created successfully!')
            setOpen(false)

            // Invalidate queries to refresh grid
            await queryClient.invalidateQueries({ queryKey: ['draft-dc'] })

            // Reset form
            resetForm()

        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || 'Failed to create draft DC')
        }
    }

    const resetForm = () => {
        setSupplierSearch('')
        setSelectedSupplier(null)
        setVehicleNo('')
        setProcess('')
        setDCType('SPM')
        setDCDate('')
        setNotes('')
        setItems([{
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
            notes: "",
        }])
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button className="gap-1.5 h-7 text-xs bg-brand text-white hover:bg-brand/90 shadow-md transition-all px-3">
                        <Plus className="h-3.5 w-3.5" />
                        New DC
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-[95vw] sm:max-w-[50vw] bg-[#0F172A] border-l border-slate-800 p-0 shadow-2xl flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
                    <SheetHeader className="px-6 py-4 border-b border-slate-800 bg-[#0F172A] flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <SheetTitle className="text-xl font-bold text-slate-100">Create New Delivery Challan</SheetTitle>
                                <SheetDescription className="text-slate-400 mt-1">
                                    Fill in the details to create a new DC. Use the sections below to organize your data.
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-[#202124]">
                        <div className="space-y-8 max-w-[1100px] mx-auto">

                            {/* Supplier Info Section - ORIGINAL DESIGN */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                        <User className="h-5 w-5" />
                                        Supplier Information
                                    </h3>
                                    {selectedSupplier && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedSupplier(null)
                                                setSupplierSearch('')
                                            }}
                                            className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 text-xs"
                                        >
                                            Change Supplier
                                        </Button>
                                    )}
                                </div>

                                {selectedSupplier ? (
                                    <div className="bg-[#1e293b]/50 p-4 rounded-lg border border-slate-800/60">
                                        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                                            <div>
                                                <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Party Name</Label>
                                                <div className="text-white font-medium text-sm mt-0.5">{selectedSupplier.partyName}</div>
                                            </div>

                                            <div>
                                                <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">GSTIN</Label>
                                                <div className="text-slate-200 font-mono text-xs mt-0.5">{selectedSupplier.gstinNumber || '-'}</div>
                                            </div>

                                            <div>
                                                <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Contact</Label>
                                                <div className="text-slate-300 text-xs mt-0.5">
                                                    {selectedSupplier.email || selectedSupplier.phone || '-'}
                                                </div>
                                            </div>

                                            <div className="col-span-3">
                                                <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Address</Label>
                                                <div className="text-slate-300 text-xs leading-snug mt-0.5">
                                                    {selectedSupplier.addressLine1}{selectedSupplier.addressLine2 && `, ${selectedSupplier.addressLine2}`}, {selectedSupplier.city}, {selectedSupplier.state} - {selectedSupplier.pinCode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#1e293b]/30 p-6 rounded-xl border border-slate-800/60">
                                        <div className="space-y-2 relative col-span-full md:col-span-1">
                                            <Label className="text-slate-100">Supplier Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                placeholder="Search supplier..."
                                                value={supplierSearch || ''}
                                                onChange={(e) => handleSupplierSearchChange(e.target.value)}
                                                className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand"
                                            />

                                            {/* Autocomplete Dropdown with smooth transitions */}
                                            {showSupplierDropdown && (
                                                <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200">
                                                    {searchError ? (
                                                        <div className="p-4 text-sm text-red-400 bg-red-950/20 rounded-lg m-2">
                                                            <span className="font-medium">Error:</span> {(searchError as Error).message}
                                                        </div>
                                                    ) : isSearching ? (
                                                        <div className="p-3 space-y-2">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className="animate-pulse">
                                                                    <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                                                                    <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : searchResults.length > 0 ? (
                                                        <div className="py-1">
                                                            {searchResults.map((supplier, index) => (
                                                                <button
                                                                    key={supplier.id}
                                                                    onClick={() => handleSupplierSelect(supplier)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-slate-800/80 transition-colors duration-150 border-b border-slate-800/50 last:border-b-0 group"
                                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                                >
                                                                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors text-sm">{supplier.partyName}</p>
                                                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors mt-0.5">
                                                                        {supplier.city}, {supplier.state}
                                                                    </p>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-2">
                                                            <div className="bg-slate-800/30 rounded-md p-2 text-center border border-slate-700/30">
                                                                <p className="text-xs text-slate-400 mb-2">No supplier found</p>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={handleCreateNewSupplier}
                                                                    className="bg-brand hover:bg-brand/90 text-white h-7 text-xs w-full"
                                                                >
                                                                    <Plus className="w-3 h-3 mr-1" />
                                                                    Create New
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </section>


                            {/* DC Details Section - ORIGINAL DESIGN */}
                            <section className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <FileText className="h-5 w-5" />
                                    DC Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1e293b]/30 p-6 rounded-xl border border-slate-800/60">
                                    <div className="space-y-2">
                                        <Label className="text-slate-100">DC Type <span className="text-red-500">*</span></Label>
                                        <Select value={dcType} onValueChange={(v) => setDCType(v as DCType)}>
                                            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 data-[placeholder]:text-slate-600">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                                <SelectItem value="SPM">SPM</SelectItem>
                                                <SelectItem value="QC">QC</SelectItem>
                                                <SelectItem value="VALVE">VALVE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-100">DC Date <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="date"
                                            value={dcDate || new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setDCDate(e.target.value)}
                                            className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-100">Process</Label>
                                        <Input
                                            placeholder="e.g. Machining"
                                            value={process}
                                            onChange={(e) => setProcess(e.target.value)}
                                            className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-100">Vehicle No</Label>
                                        <Input
                                            placeholder="TN-XX-XXXX"
                                            value={vehicleNo}
                                            onChange={(e) => setVehicleNo(e.target.value)}
                                            className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-brand"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Line Items Section - MODAL APPROACH */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                        <Package className="h-5 w-5" />
                                        Line Items ({items.length})
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

                                {/* Add Items Button */}
                                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-6">
                                    <Button
                                        type="button"
                                        onClick={() => setShowAddItemsModal(true)}
                                        className="w-full bg-brand hover:bg-brand/90 text-white h-12 text-base gap-2"
                                    >
                                        {items.length === 0 ? (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                Add Items
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="h-5 w-5" />
                                                Update Items
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Items Summary - Show only if items exist */}
                                {items.length > 0 && (
                                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#1e293b]/20">
                                        <div className="overflow-x-auto custom-scrollbar">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-900/80 text-slate-400 font-medium uppercase text-xs tracking-wider">
                                                    <tr>
                                                        <th className="px-4 py-3 w-12 text-center">#</th>
                                                        <th className="px-3 py-3">Item Name</th>
                                                        <th className="px-3 py-3">Description</th>
                                                        <th className="px-3 py-3 text-right">Qty</th>
                                                        <th className="px-3 py-3">UOM</th>
                                                        {enableWeight && <th className="px-3 py-3 text-right">Total Wt</th>}
                                                        {enableSqft && <th className="px-3 py-3 text-right">Total SqFt</th>}
                                                        <th className="px-3 py-3 text-right">Rate</th>
                                                        <th className="px-3 py-3 text-center w-16">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800">
                                                    {items.map((item, index) => (
                                                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                                            <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                                                            <td className="px-3 py-3 text-slate-200 font-medium">{item.itemName}</td>
                                                            <td className="px-3 py-3 text-slate-400 max-w-[200px] truncate" title={item.description}>
                                                                {item.description || '-'}
                                                            </td>
                                                            <td className="px-3 py-3 text-right text-slate-200 font-medium">{item.quantity}</td>
                                                            <td className="px-3 py-3 text-slate-300">{item.uom}</td>
                                                            {enableWeight && (
                                                                <td className="px-3 py-3 text-right text-teal-300 font-medium">{item.totalWeight}</td>
                                                            )}
                                                            {enableSqft && (
                                                                <td className="px-3 py-3 text-right text-blue-300 font-medium">{item.totalSqft}</td>
                                                            )}
                                                            <td className="px-3 py-3 text-right text-amber-300 font-medium">
                                                                {item.rate ? `₹${item.rate}` : '-'}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors opacity-50 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Additional Info Section - ORIGINAL DESIGN */}
                            <section className="space-y-4 pb-4">
                                <h3 className="text-lg font-semibold text-white">Notes & Terms</h3>
                                <Textarea
                                    placeholder="Enter any specific notes, terms or delivery instructions..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
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

                        <Button
                            onClick={handleSaveDraft}
                            disabled={createDraftDC.isPending || createDraftDCItems.isPending}
                            className="bg-slate-700 text-slate-200 hover:bg-slate-600"
                        >
                            {(createDraftDC.isPending || createDraftDCItems.isPending) ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save as Draft'
                            )}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Create Supplier Modal */}
            <CreateSupplierModal
                open={showCreateSupplier}
                onOpenChange={setShowCreateSupplier}
                supplierName={supplierSearch}
                onSupplierCreated={(supplier) => {
                    console.log('Supplier created:', supplier)
                    setSelectedSupplier(supplier)
                    setSupplierSearch(supplier?.partyName || '')
                    setShowSupplierDropdown(false)
                    setShowCreateSupplier(false)
                }}
            />

            {/* Add/Update Items Modal */}
            <AddItemsModal
                open={showAddItemsModal}
                onOpenChange={setShowAddItemsModal}
                onConfirm={handleItemsConfirm}
                enableWeight={enableWeight}
                enableSqft={enableSqft}
                mode={items.length > 0 ? "update" : "add"}
                initialItems={items}
            />
        </>
    )
}
