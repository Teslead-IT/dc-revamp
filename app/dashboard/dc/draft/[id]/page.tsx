"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDraftDC, useDeleteDraftDC, useUpdateDraftDC } from "@/hooks/use-draft-dc"
import { useSearchSuppliers } from "@/hooks/use-suppliers"
import { useCreateDraftDCItems, useUpdateDraftDCItems, useDeleteDraftDCItem } from "@/hooks/use-draft-dc-items"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Package, Truck, Calendar, FileText, Loader2, Edit, Trash2, Save, X, Plus, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DCDeleteDialog } from "@/components/dc-grid/dc-delete-dialog"
import { AddItemsModal } from "@/components/dc-grid/add-items-modal"
import { CreateSupplierModal } from "@/components/dc-grid/create-supplier-modal"
import { showToast as toast } from "@/lib/toast-service"
import type { Supplier } from "@/lib/api-client"

interface ItemRow {
    id: number // Database numeric ID
    itemId?: string // String ID like "DCITEM000012"
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

export default function DraftDCViewPage() {
    const params = useParams()
    const router = useRouter()
    const draftId = params.id as string
    const queryClient = useQueryClient()

    const { data: draftDC, isLoading, error } = useDraftDC(draftId)
    const deleteDraftDC = useDeleteDraftDC()
    const updateDraftDC = useUpdateDraftDC()
    const createDraftDCItems = useCreateDraftDCItems()
    const updateDraftDCItems = useUpdateDraftDCItems()
    const deleteDraftDCItem = useDeleteDraftDCItem()

    const [isEditMode, setIsEditMode] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Supplier management
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [showSupplierSearch, setShowSupplierSearch] = useState(false)
    const [showCreateSupplier, setShowCreateSupplier] = useState(false)
    const [supplierSearch, setSupplierSearch] = useState('')
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)
    const { data: searchResults = [], isLoading: isSearching, error: searchError } = useSearchSuppliers(supplierSearch)

    // Items management
    const [showAddItemsModal, setShowAddItemsModal] = useState(false)
    const [items, setItems] = useState<ItemRow[]>([])

    // Editable state for DC details
    const [editableDC, setEditableDC] = useState<any>({})

    useEffect(() => {
        if (draftDC) {
            const draft = draftDC as any

            setEditableDC({
                dcType: draft.dcType,
                process: draft.process,
                dcDate: draft.dcDate?.split('T')[0],
                vehicleNo: draft.vehicleNo,
                notes: draft.notes,
                showWeight: draft.showWeight,
                showSquareFeet: draft.showSquareFeet
            })

            // Set supplier from draft
            const partyDetails = draft.partyDetails || draft
            setSelectedSupplier({
                partyId: draft.partyId,
                partyName: partyDetails.partyName || '',
                addressLine1: partyDetails.partyAddressLine1 || partyDetails.addressLine1 || '',
                addressLine2: partyDetails.partyAddressLine2 || partyDetails.addressLine2 || '',
                state: partyDetails.partyState || partyDetails.state || '',
                city: partyDetails.partyCity || partyDetails.city || '',
                pinCode: partyDetails.partyPinCode || partyDetails.pinCode || '',
                stateCode: partyDetails.partyStateCode || partyDetails.stateCode || 33,
                gstinNumber: partyDetails.partyGstinNumber || partyDetails.gstinNumber || '',
                email: partyDetails.partyEmail || partyDetails.email || '',
                phone: partyDetails.partyPhone || partyDetails.phone || ''
            } as Supplier)

            // Convert draft items to ItemRow format
            setItems(draft.draftDcItems?.map((item: any) => ({
                id: item.id,
                itemId: item.itemId, // Capture the string itemId (DCITEM000012)
                itemName: item.itemName,
                description: item.itemDescription,
                projectName: item.projectName,
                projectIncharge: item.projectIncharge,
                quantity: String(item.quantity),
                uom: item.uom,
                weightPerUnit: String(item.weightPerUnit),
                totalWeight: String(item.totalWeight),
                sqftPerUnit: String(item.squareFeetPerUnit),
                totalSqft: String(item.totalSquareFeet),
                rate: String(item.ratePerEach),
                remarks: item.remarks,
                notes: item.notes
            })) || [])
        }
    }, [draftDC])

    const handleDelete = async () => {
        await deleteDraftDC.mutateAsync(draftId)
        router.push('/dashboard/dc/all')
    }

    const handleEditToggle = () => {
        if (isEditMode) {
            // Cancel edit - reset to original values
            if (draftDC) {
                const draft = draftDC as any
                setEditableDC({
                    dcType: draft.dcType,
                    process: draft.process,
                    dcDate: draft.dcDate?.split('T')[0],
                    vehicleNo: draft.vehicleNo,
                    notes: draft.notes,
                    showWeight: draft.showWeight,
                    showSquareFeet: draft.showSquareFeet
                })

                const partyDetails = draft.partyDetails || draft
                setSelectedSupplier({
                    partyId: draft.partyId,
                    partyName: partyDetails.partyName || '',
                    addressLine1: partyDetails.partyAddressLine1 || partyDetails.addressLine1 || '',
                    addressLine2: partyDetails.partyAddressLine2 || partyDetails.addressLine2 || '',
                    state: partyDetails.partyState || partyDetails.state || '',
                    city: partyDetails.partyCity || partyDetails.city || '',
                    pinCode: partyDetails.partyPinCode || partyDetails.pinCode || '',
                    stateCode: partyDetails.partyStateCode || partyDetails.stateCode || 33,
                    gstinNumber: partyDetails.partyGstinNumber || partyDetails.gstinNumber || '',
                    email: partyDetails.partyEmail || partyDetails.email || '',
                    phone: partyDetails.partyPhone || partyDetails.phone || ''
                } as Supplier)

                setItems(draft.draftDcItems?.map((item: any) => ({
                    id: item.id,
                    itemId: item.itemId, // Capture the string itemId (DCITEM000012)
                    itemName: item.itemName,
                    description: item.itemDescription,
                    projectName: item.projectName,
                    projectIncharge: item.projectIncharge,
                    quantity: String(item.quantity),
                    uom: item.uom,
                    weightPerUnit: String(item.weightPerUnit),
                    totalWeight: String(item.totalWeight),
                    sqftPerUnit: String(item.squareFeetPerUnit),
                    totalSqft: String(item.totalSquareFeet),
                    rate: String(item.ratePerEach),
                    remarks: item.remarks,
                    notes: item.notes
                })) || [])
            }
            setHasChanges(false)
            setShowSupplierSearch(false)
        }
        setIsEditMode(!isEditMode)
    }

    const handleSupplierSelect = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setSupplierSearch(supplier.partyName)
        setShowSupplierDropdown(false)
        setShowSupplierSearch(false)
        setHasChanges(true)
    }

    const handleSupplierSearchChange = (value: string) => {
        setSupplierSearch(value)
        setShowSupplierDropdown(value.length >= 2)
    }

    const handleItemsConfirm = (updatedItems: ItemRow[]) => {
        setItems(updatedItems)
        setHasChanges(true)
    }

    const handleRemoveItem = (itemNumericId: number) => {
        setItemToDelete(itemNumericId)
        setDeleteItemDialogOpen(true)
    }

    const confirmItemDelete = async () => {
        if (itemToDelete === null) return

        const item = items.find(i => i.id === itemToDelete)
        if (!item) return

        if (!item.itemId) {
            toast.error('Cannot delete item: itemId not found')
            return
        }

        try {
            // Use itemId (string like "DCITEM000012") not numeric id
            await deleteDraftDCItem.mutateAsync(item.itemId)
            toast.success('Item deleted successfully')
            setItems(items.filter(i => i.id !== itemToDelete))
            setHasChanges(true)
            setDeleteItemDialogOpen(false)
            setItemToDelete(null)
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete item')
        }
    }

    const handleSaveAll = async () => {
        if (!selectedSupplier) {
            toast.error('Please select a supplier')
            return
        }

        setIsSaving(true)

        const updates: string[] = []

        try {
            const draft = draftDC as any

            // 1. Update Draft DC (including supplier change and showWeight/showSquareFeet)
            await updateDraftDC.mutateAsync({
                id: draftId,
                data: {
                    partyId: selectedSupplier.partyId,
                    dcType: editableDC.dcType,
                    process: editableDC.process,
                    dcDate: editableDC.dcDate,
                    vehicleNo: editableDC.vehicleNo,
                    notes: editableDC.notes,
                    showWeight: editableDC.showWeight,
                    showSquareFeet: editableDC.showSquareFeet
                }
            })
            updates.push('DC Details')

            // 2. Separate existing items from new items
            const existingItems = items.filter(item => item.itemId) // Has itemId = existing
            const newItems = items.filter(item => !item.itemId) // No itemId = new

            // 3. Update existing items using update endpoint (only send itemId + changed fields)
            if (existingItems.length > 0) {
                const updateItemsData = existingItems.map(item => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemDescription: item.description,
                    projectName: item.projectName,
                    projectIncharge: item.projectIncharge,
                    quantity: parseFloat(item.quantity) || 0,
                    uom: item.uom || 'KG',
                    weightPerUnit: editableDC.showWeight ? (parseFloat(item.weightPerUnit) || 0) : 0,
                    totalWeight: editableDC.showWeight ? (parseFloat(item.totalWeight) || 0) : 0,
                    squareFeetPerUnit: editableDC.showSquareFeet ? (parseFloat(item.sqftPerUnit) || 0) : 0,
                    totalSquareFeet: editableDC.showSquareFeet ? (parseFloat(item.totalSqft) || 0) : 0,
                    ratePerEach: parseFloat(item.rate) || 0,
                    remarks: item.remarks || '',
                    notes: item.notes || '',
                }))

                await updateDraftDCItems.mutateAsync({
                    id: draftId,
                    items: updateItemsData
                })
                updates.push(`${existingItems.length} Items Updated`)
            }

            // 4. Create new items using create endpoint
            if (newItems.length > 0) {
                const createItemsData = newItems.map(item => ({
                    itemName: item.itemName,
                    itemDescription: item.description,
                    uom: item.uom || 'KG',
                    quantity: parseFloat(item.quantity) || 0,
                    weightPerUnit: editableDC.showWeight ? (parseFloat(item.weightPerUnit) || 0) : 0,
                    totalWeight: editableDC.showWeight ? (parseFloat(item.totalWeight) || 0) : 0,
                    ratePerEach: parseFloat(item.rate) || 0,
                    squareFeetPerUnit: editableDC.showSquareFeet ? (parseFloat(item.sqftPerUnit) || 0) : 0,
                    totalSquareFeet: editableDC.showSquareFeet ? (parseFloat(item.totalSqft) || 0) : 0,
                    remarks: item.remarks || '',
                    projectName: item.projectName || '',
                    projectIncharge: item.projectIncharge || '',
                    notes: item.notes || '',
                }))

                await createDraftDCItems.mutateAsync({
                    draftId: draftId,
                    partyId: selectedSupplier.partyId,
                    items: createItemsData
                })
                updates.push(`${newItems.length} New Items Added`)
            }

            // Success
            toast.success(`Successfully updated: ${updates.join(', ')}`, {
                description: 'All changes have been saved'
            })

            // Invalidate and refetch draft DC data to show updates
            await queryClient.invalidateQueries({ queryKey: ['draft-dc', 'detail', draftId] })
            await queryClient.refetchQueries({ queryKey: ['draft-dc', 'detail', draftId] })

            setIsEditMode(false)
            setHasChanges(false)
        } catch (error: any) {
            console.error('❌ Error during save:', error)
            toast.error('Failed to save changes', {
                description: error.message || 'An error occurred while saving. Please try again.'
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-brand mx-auto mb-4" />
                    <p className="text-slate-400">Loading draft DC...</p>
                </div>
            </div>
        )
    }

    if (error || !draftDC) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Error loading draft DC</p>
                    <Button onClick={() => router.back()} variant="outline">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    const draft = draftDC as any

    return (
        <div className="min-h-screen bg-[#0F172A] p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.back()}
                            variant="ghost"
                            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{draft.draftId}</h1>
                            <p className="text-slate-400 mt-1">Draft Delivery Challan</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {!isEditMode ? (
                            <>
                                <Button
                                    onClick={handleEditToggle}
                                    variant="ghost"
                                    className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => setDeleteDialogOpen(true)}
                                    variant="ghost"
                                    className="bg-red-950/50 text-red-400 hover:bg-red-950 hover:text-white border border-red-800"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                {hasChanges && (
                                    <Button
                                        onClick={handleSaveAll}
                                        disabled={isSaving}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Update Details
                                            </>
                                        )}
                                    </Button>
                                )}
                                <Button
                                    onClick={handleEditToggle}
                                    variant="ghost"
                                    className="bg-slate-700 text-slate-200 hover:bg-slate-600"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete DC Dialog */}
            <DCDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                itemName={draft.draftId}
            />

            {/* Delete Item Dialog */}
            <DCDeleteDialog
                open={deleteItemDialogOpen}
                onOpenChange={setDeleteItemDialogOpen}
                onConfirm={confirmItemDelete}
                itemName={itemToDelete !== null ? items.find(i => i.id === itemToDelete)?.itemName || 'Item' : 'Item'}
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* DC Details Card */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <FileText className="h-5 w-5 text-brand" />
                                DC Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Draft ID</p>
                                <p className="text-white font-medium">{draft.draftId}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">DC Type *</p>
                                {isEditMode ? (
                                    <Select
                                        value={editableDC.dcType}
                                        onValueChange={(value) => {
                                            setEditableDC({ ...editableDC, dcType: value })
                                            setHasChanges(true)
                                        }}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            <SelectItem value="SPM">SPM</SelectItem>
                                            <SelectItem value="QC">QC</SelectItem>
                                            <SelectItem value="VALVE">VALVE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                                        {editableDC.dcType}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Process</p>
                                {isEditMode ? (
                                    <Input
                                        value={editableDC.process}
                                        onChange={(e) => {
                                            setEditableDC({ ...editableDC, process: e.target.value })
                                            setHasChanges(true)
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{editableDC.process}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">DC Date *</p>
                                {isEditMode ? (
                                    <Input
                                        type="date"
                                        value={editableDC.dcDate}
                                        onChange={(e) => {
                                            setEditableDC({ ...editableDC, dcDate: e.target.value })
                                            setHasChanges(true)
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                ) : (
                                    <p className="text-white font-medium">
                                        {new Date(editableDC.dcDate).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Vehicle Number</p>
                                {isEditMode ? (
                                    <Input
                                        value={editableDC.vehicleNo}
                                        onChange={(e) => {
                                            setEditableDC({ ...editableDC, vehicleNo: e.target.value })
                                            setHasChanges(true)
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        placeholder="TN-XX-XXXX"
                                    />
                                ) : (
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-slate-400" />
                                        {editableDC.vehicleNo}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Status</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
                                    {draft.status}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <p className="text-slate-400 text-sm mb-1">Notes</p>
                                {isEditMode ? (
                                    <Textarea
                                        value={editableDC.notes || ''}
                                        onChange={(e) => {
                                            setEditableDC({ ...editableDC, notes: e.target.value })
                                            setHasChanges(true)
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-white">{editableDC.notes || 'No notes'}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Table */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Package className="h-5 w-5 text-brand" />
                                Items ({items.length})
                            </CardTitle>
                            {isEditMode && (
                                <div className="flex items-center gap-4">
                                    {/* Show Weight Checkbox */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="showWeight"
                                            checked={editableDC.showWeight}
                                            onCheckedChange={(checked) => {
                                                setEditableDC({ ...editableDC, showWeight: !!checked })
                                                setHasChanges(true)
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                                        />
                                        <Label
                                            htmlFor="showWeight"
                                            className="text-sm font-medium text-slate-300 cursor-pointer"
                                        >
                                            Show Weight
                                        </Label>
                                    </div>

                                    {/* Show Square Feet Checkbox */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="showSquareFeet"
                                            checked={editableDC.showSquareFeet}
                                            onCheckedChange={(checked) => {
                                                setEditableDC({ ...editableDC, showSquareFeet: !!checked })
                                                setHasChanges(true)
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                                        />
                                        <Label
                                            htmlFor="showSquareFeet"
                                            className="text-sm font-medium text-slate-300 cursor-pointer"
                                        >
                                            Show Sq.Ft
                                        </Label>
                                    </div>

                                    {/* Update Items Button */}
                                    <Button
                                        onClick={() => setShowAddItemsModal(true)}
                                        size="sm"
                                        className="bg-brand hover:bg-brand/90"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Update Items
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-800/50 text-slate-300">
                                        <tr>
                                            <th className="px-4 py-3 text-left">#</th>
                                            <th className="px-4 py-3 text-left">Item Name</th>
                                            <th className="px-4 py-3 text-left">Description</th>
                                            <th className="px-4 py-3 text-left">Project</th>
                                            <th className="px-4 py-3 text-left">Incharge</th>
                                            <th className="px-4 py-3 text-right">Qty</th>
                                            <th className="px-4 py-3 text-left">UOM</th>
                                            {(isEditMode ? editableDC.showWeight : draft.showWeight) && (
                                                <>
                                                    <th className="px-4 py-3 text-right">Wt/Unit</th>
                                                    <th className="px-4 py-3 text-right">Total Wt</th>
                                                </>
                                            )}
                                            {(isEditMode ? editableDC.showSquareFeet : draft.showSquareFeet) && (
                                                <>
                                                    <th className="px-4 py-3 text-right">SqFt/Unit</th>
                                                    <th className="px-4 py-3 text-right">Total SqFt</th>
                                                </>
                                            )}
                                            <th className="px-4 py-3 text-right">Rate</th>
                                            <th className="px-4 py-3 text-left">Remarks</th>
                                            {isEditMode && <th className="px-4 py-3 text-center">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300 divide-y divide-slate-800">
                                        {items.map((item, index) => (
                                            <tr key={item.id || `item-${index}`} className="hover:bg-slate-800/30">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-white">{item.itemName}</div>
                                                    {item.notes && (
                                                        <div className="text-xs text-slate-500 mt-1 italic">
                                                            Note: {item.notes}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">{item.description}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-slate-400">{item.projectName || '-'}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-slate-400">{item.projectIncharge || '-'}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="font-medium">{item.quantity}</span>
                                                </td>
                                                <td className="px-4 py-3">{item.uom}</td>
                                                {(isEditMode ? editableDC.showWeight : draft.showWeight) && (
                                                    <>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-teal-300">{item.weightPerUnit}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-teal-300 font-medium">{item.totalWeight}</td>
                                                    </>
                                                )}
                                                {(isEditMode ? editableDC.showSquareFeet : draft.showSquareFeet) && (
                                                    <>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-blue-300">{item.sqftPerUnit}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-blue-300 font-medium">{item.totalSqft}</td>
                                                    </>
                                                )}
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-amber-300 font-medium">₹{item.rate}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-slate-500 italic">{item.remarks || '-'}</span>
                                                </td>
                                                {isEditMode && (
                                                    <td className="px-4 py-3 text-center">
                                                        <Button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Party Details */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <User className="h-5 w-5 text-brand" />
                                Supplier Details
                            </CardTitle>
                            {isEditMode && !showSupplierSearch && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSupplierSearch(true)}
                                    className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 text-xs"
                                >
                                    <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                                    Change Supplier
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isEditMode && showSupplierSearch ? (
                                <div className="space-y-4">
                                    <div className="space-y-2 relative">
                                        <Input
                                            placeholder="Search supplier..."
                                            value={supplierSearch}
                                            onChange={(e) => handleSupplierSearchChange(e.target.value)}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />

                                        {/* Autocomplete Dropdown */}
                                        {showSupplierDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {searchError ? (
                                                    <div className="p-3 text-sm text-red-400">
                                                        Error: {(searchError as Error).message}
                                                    </div>
                                                ) : isSearching ? (
                                                    <div className="p-3 text-sm text-slate-400">Searching...</div>
                                                ) : searchResults.length > 0 ? (
                                                    searchResults.map((supplier) => (
                                                        <button
                                                            key={supplier.id}
                                                            onClick={() => handleSupplierSelect(supplier)}
                                                            className="w-full text-left px-4 py-2 hover:bg-slate-800 border-b border-slate-800 last:border-b-0"
                                                        >
                                                            <p className="font-medium text-slate-200">{supplier.partyName}</p>
                                                            <p className="text-xs text-slate-400">{supplier.city}, {supplier.state}</p>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center">
                                                        <p className="text-sm text-slate-400 mb-2">No supplier found</p>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setShowCreateSupplier(true)
                                                                setShowSupplierDropdown(false)
                                                            }}
                                                            className="bg-brand hover:bg-brand/90"
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" />
                                                            Create New
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowSupplierSearch(false)}
                                            className="flex-1 bg-slate-700 text-slate-200 hover:bg-slate-600"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : selectedSupplier ? (
                                <>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Name</p>
                                        <p className="text-white font-medium">{selectedSupplier.partyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Address</p>
                                        <p className="text-white text-sm">
                                            {selectedSupplier.addressLine1}
                                            {selectedSupplier.addressLine2 && <>, {selectedSupplier.addressLine2}</>}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-slate-400 text-sm mb-1">City</p>
                                            <p className="text-white text-sm">{selectedSupplier.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm mb-1">State</p>
                                            <p className="text-white text-sm">{selectedSupplier.state}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Pincode</p>
                                        <p className="text-white font-medium">{selectedSupplier.pinCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">GSTIN</p>
                                        <p className="text-white font-mono text-sm">{selectedSupplier.gstinNumber || '-'}</p>
                                    </div>
                                </>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-brand" />
                                Other Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-slate-400 text-sm">Created</p>
                                <p className="text-white text-sm">
                                    {new Date(draft.createdAt).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Last Updated</p>
                                <p className="text-white text-sm">
                                    {new Date(draft.updatedAt).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Update Items Modal */}
            <AddItemsModal
                open={showAddItemsModal}
                onOpenChange={setShowAddItemsModal}
                onConfirm={handleItemsConfirm}
                enableWeight={editableDC.showWeight}
                enableSqft={editableDC.showSquareFeet}
                initialItems={items}
                mode="update"
            />

            {/* Create Supplier Modal */}
            <CreateSupplierModal
                open={showCreateSupplier}
                onOpenChange={setShowCreateSupplier}
                supplierName={supplierSearch}
                onSupplierCreated={(supplier) => {
                    setSelectedSupplier(supplier)
                    setSupplierSearch(supplier.partyName)
                    setShowSupplierDropdown(false)
                    setShowSupplierSearch(false)
                    setShowCreateSupplier(false)
                    setHasChanges(true)
                }}
            />
        </div>
    )
}
