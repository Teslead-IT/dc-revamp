"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDraftDC, useDeleteDraftDC, useUpdateDraftDC } from "@/hooks/use-draft-dc"
import { useUpdateSupplier } from "@/hooks/use-suppliers"
import { useCreateDraftDCItems, useUpdateDraftDCItems, useDeleteDraftDCItem } from "@/hooks/use-draft-dc-items"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Package, Truck, Calendar, FileText, Loader2, Edit, Trash2, Save, X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DCDeleteDialog } from "@/components/dc-grid/dc-delete-dialog"
import { toast } from "sonner"

interface EditableItem {
    id?: number
    itemId?: number
    itemName: string
    itemDescription: string
    projectName: string
    projectIncharge: string
    quantity: number
    uom: string
    weightPerUnit: number
    totalWeight: number
    squareFeetPerUnit: number
    totalSquareFeet: number
    ratePerEach: number
    remarks: string
    notes: string
}

export default function DraftDCViewPage() {
    const params = useParams()
    const router = useRouter()
    const draftId = params.id as string

    const { data: draftDC, isLoading, error } = useDraftDC(draftId)
    const deleteDraftDC = useDeleteDraftDC()
    const updateDraftDC = useUpdateDraftDC()
    const updateSupplier = useUpdateSupplier()
    const createDraftDCItems = useCreateDraftDCItems()
    const updateDraftDCItems = useUpdateDraftDCItems()
    const deleteDraftDCItem = useDeleteDraftDCItem()

    const [isEditMode, setIsEditMode] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Editable state for DC details
    const [editableDC, setEditableDC] = useState<any>({})

    // Editable state for supplier/party details
    const [editableSupplier, setEditableSupplier] = useState<any>({})

    // Editable state for items
    const [editableItems, setEditableItems] = useState<EditableItem[]>([])

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

            // Check if party details are in a nested object or flattened
            const partyDetails = draft.partyDetails || draft
            setEditableSupplier({
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
            })

            setEditableItems(draft.draftDcItems?.map((item: any) => ({
                id: item.id,
                itemId: item.itemId,
                draftId: item.draftId,
                itemName: item.itemName,
                itemDescription: item.itemDescription,
                projectName: item.projectName,
                projectIncharge: item.projectIncharge,
                quantity: item.quantity,
                uom: item.uom,
                weightPerUnit: item.weightPerUnit,
                totalWeight: item.totalWeight,
                squareFeetPerUnit: item.squareFeetPerUnit,
                totalSquareFeet: item.totalSquareFeet,
                ratePerEach: item.ratePerEach,
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
                setEditableSupplier({
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
                })

                setEditableItems(draft.draftDcItems?.map((item: any) => ({
                    id: item.id,
                    itemId: item.itemId,
                    draftId: item.draftId,
                    itemName: item.itemName,
                    itemDescription: item.itemDescription,
                    projectName: item.projectName,
                    projectIncharge: item.projectIncharge,
                    quantity: item.quantity,
                    uom: item.uom,
                    weightPerUnit: item.weightPerUnit,
                    totalWeight: item.totalWeight,
                    squareFeetPerUnit: item.squareFeetPerUnit,
                    totalSquareFeet: item.totalSquareFeet,
                    ratePerEach: item.ratePerEach,
                    remarks: item.remarks,
                    notes: item.notes
                })) || [])
            }
            setHasChanges(false)
        }
        setIsEditMode(!isEditMode)
    }

    const handleAddNewItem = () => {
        setEditableItems([...editableItems, {
            itemName: '',
            itemDescription: '',
            projectName: '',
            projectIncharge: '',
            quantity: 0,
            uom: '',
            weightPerUnit: 0,
            totalWeight: 0,
            squareFeetPerUnit: 0,
            totalSquareFeet: 0,
            ratePerEach: 0,
            remarks: '',
            notes: ''
        }])
        setHasChanges(true)
    }

    const handleRemoveItem = async (index: number) => {
        const item = editableItems[index]

        // If item has an ID, it's an existing item - delete from DB
        if (item.id) {
            if (confirm(`Delete "${item.itemName}"? This action cannot be undone.`)) {
                try {
                    await deleteDraftDCItem.mutateAsync(item.id)
                    toast.success('Item deleted successfully')
                    // Remove from local state after successful delete
                    setEditableItems(editableItems.filter((_, i) => i !== index))
                } catch (error: any) {
                    toast.error(error.message || 'Failed to delete item')
                }
            }
        } else {
            // New item not yet saved - just remove from list
            setEditableItems(editableItems.filter((_, i) => i !== index))
        }
        setHasChanges(true)
    }

    const handleItemChange = (index: number, field: keyof EditableItem, value: any) => {
        const newItems = [...editableItems]
        newItems[index] = { ...newItems[index], [field]: value }

        // Auto-calculate totals
        if (field === 'quantity' || field === 'weightPerUnit') {
            newItems[index].totalWeight = newItems[index].quantity * newItems[index].weightPerUnit
        }
        if (field === 'quantity' || field === 'squareFeetPerUnit') {
            newItems[index].totalSquareFeet = newItems[index].quantity * newItems[index].squareFeetPerUnit
        }

        setEditableItems(newItems)
        setHasChanges(true)
    }

    const handleSaveAll = async () => {
        setIsSaving(true)

        const updates: string[] = []

        try {
            const draft = draftDC as any

            // 1. Update Draft DC
            console.log('Step 1: Updating Draft DC...')
            await updateDraftDC.mutateAsync({
                id: draftId,
                data: {
                    dcType: editableDC.dcType,
                    process: editableDC.process,
                    dcDate: editableDC.dcDate,
                    vehicleNo: editableDC.vehicleNo,
                    notes: editableDC.notes,
                    showWeight: editableDC.showWeight,
                    showSquareFeet: editableDC.showSquareFeet
                }
            })
            console.log('✓ Draft DC updated successfully')
            updates.push('DC Details')

            // 2. Update Supplier (if partyId exists)
            if (editableSupplier.partyId) {
                console.log('Step 2: Updating Supplier...')
                await updateSupplier.mutateAsync({
                    id: editableSupplier.partyId,
                    data: {
                        partyName: editableSupplier.partyName,
                        addressLine1: editableSupplier.addressLine1,
                        addressLine2: editableSupplier.addressLine2,
                        state: editableSupplier.state,
                        city: editableSupplier.city,
                        pinCode: editableSupplier.pinCode,
                        stateCode: editableSupplier.stateCode,
                        gstinNumber: editableSupplier.gstinNumber,
                        email: editableSupplier.email,
                        phone: editableSupplier.phone
                    }
                })
                console.log('✓ Supplier updated successfully')
                updates.push('Supplier Details')
            }

            // 3. Add new items
            const newItems = editableItems.filter(item => !item.id)
            if (newItems.length > 0) {
                console.log(`Step 3: Adding ${newItems.length} new item(s)...`)
                await createDraftDCItems.mutateAsync({
                    draftId: parseInt(draftId),
                    items: newItems.map(item => ({
                        itemName: item.itemName,
                        description: item.itemDescription,
                        projectName: item.projectName,
                        projectIncharge: item.projectIncharge,
                        quantity: item.quantity,
                        uom: item.uom,
                        weightPerUnit: item.weightPerUnit,
                        totalWeight: item.totalWeight,
                        squareFeetPerUnit: item.squareFeetPerUnit,
                        totalSquareFeet: item.totalSquareFeet,
                        ratePerEach: item.ratePerEach,
                        remarks: item.remarks,
                        notes: item.notes
                    }))
                })
                console.log(`✓ ${newItems.length} new item(s) added successfully`)
                updates.push(`${newItems.length} New Items`)
            }

            // 4. Update existing items
            const existingItems = editableItems.filter(item => item.id)
            if (existingItems.length > 0) {
                console.log(`Step 4: Updating ${existingItems.length} existing item(s)...`)
                await updateDraftDCItems.mutateAsync({
                    id: draftId,
                    items: existingItems.map(item => ({
                        itemId: item.itemId,
                        itemName: item.itemName,
                        itemDescription: item.itemDescription,
                        projectName: item.projectName,
                        projectIncharge: item.projectIncharge,
                        quantity: item.quantity,
                        uom: item.uom,
                        weightPerUnit: item.weightPerUnit,
                        totalWeight: item.totalWeight,
                        squareFeetPerUnit: item.squareFeetPerUnit,
                        totalSquareFeet: item.totalSquareFeet,
                        ratePerEach: item.ratePerEach,
                        remarks: item.remarks,
                        notes: item.notes
                    }))
                })
                console.log(`✓ ${existingItems.length} existing item(s) updated successfully`)
                updates.push(`${existingItems.length} Items Updated`)
            }

            // Success: All updates completed
            console.log('✓ All updates completed successfully')
            toast.success(`Successfully updated: ${updates.join(', ')}`, {
                description: 'All changes have been saved'
            })

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

            <DCDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                itemName={draft.draftId}
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
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="SPM">SPM</SelectItem>
                                            <SelectItem value="NSPM">NSPM</SelectItem>
                                            <SelectItem value="Service">Service</SelectItem>
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
                                Items ({editableItems.length})
                            </CardTitle>
                            {isEditMode && (
                                <Button
                                    onClick={handleAddNewItem}
                                    size="sm"
                                    className="bg-brand hover:bg-brand/90"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Item
                                </Button>
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
                                            {draft.showWeight && (
                                                <>
                                                    <th className="px-4 py-3 text-right">Wt/Unit</th>
                                                    <th className="px-4 py-3 text-right">Total Wt</th>
                                                </>
                                            )}
                                            {draft.showSquareFeet && (
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
                                        {editableItems.map((item, index) => (
                                            <tr key={item.id || `new-${index}`} className="hover:bg-slate-800/30">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    {isEditMode ? (
                                                        <Input
                                                            value={item.itemName}
                                                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                                            className="min-w-[150px] bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        <div>
                                                            <div className="font-medium text-white">{item.itemName}</div>
                                                            {item.notes && (
                                                                <div className="text-xs text-slate-500 mt-1 italic">
                                                                    Note: {item.notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {isEditMode ? (
                                                        <Input
                                                            value={item.itemDescription}
                                                            onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
                                                            className="min-w-[150px] bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        item.itemDescription
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {isEditMode ? (
                                                        <Input
                                                            value={item.projectName}
                                                            onChange={(e) => handleItemChange(index, 'projectName', e.target.value)}
                                                            className="min-w-[120px] bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-400">{item.projectName || '-'}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {isEditMode ? (
                                                        <Input
                                                            value={item.projectIncharge}
                                                            onChange={(e) => handleItemChange(index, 'projectIncharge', e.target.value)}
                                                            className="min-w-[120px] bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-400">{item.projectIncharge || '-'}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {isEditMode ? (
                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                            className="w-20 bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{item.quantity}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {isEditMode ? (
                                                        <Input
                                                            value={item.uom}
                                                            onChange={(e) => handleItemChange(index, 'uom', e.target.value)}
                                                            className="w-20 bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        item.uom
                                                    )}
                                                </td>
                                                {draft.showWeight && (
                                                    <>
                                                        <td className="px-4 py-3 text-right">
                                                            {isEditMode ? (
                                                                <Input
                                                                    type="number"
                                                                    value={item.weightPerUnit}
                                                                    onChange={(e) => handleItemChange(index, 'weightPerUnit', parseFloat(e.target.value) || 0)}
                                                                    className="w-24 bg-slate-800 border-slate-700 text-teal-300 h-9"
                                                                />
                                                            ) : (
                                                                <span className="text-teal-300">{item.weightPerUnit}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-teal-300 font-medium">{item.totalWeight}</td>
                                                    </>
                                                )}
                                                {draft.showSquareFeet && (
                                                    <>
                                                        <td className="px-4 py-3 text-right">
                                                            {isEditMode ? (
                                                                <Input
                                                                    type="number"
                                                                    value={item.squareFeetPerUnit}
                                                                    onChange={(e) => handleItemChange(index, 'squareFeetPerUnit', parseFloat(e.target.value) || 0)}
                                                                    className="w-24 bg-slate-800 border-slate-700 text-blue-300 h-9"
                                                                />
                                                            ) : (
                                                                <span className="text-blue-300">{item.squareFeetPerUnit}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-blue-300 font-medium">{item.totalSquareFeet}</td>
                                                    </>
                                                )}
                                                <td className="px-4 py-3 text-right">
                                                    {isEditMode ? (
                                                        <Input
                                                            type="number"
                                                            value={item.ratePerEach}
                                                            onChange={(e) => handleItemChange(index, 'ratePerEach', parseFloat(e.target.value) || 0)}
                                                            className="w-24 bg-slate-800 border-slate-700 text-amber-300 h-9"
                                                        />
                                                    ) : (
                                                        <span className="text-amber-300 font-medium">₹{item.ratePerEach}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {isEditMode ? (
                                                        <Input
                                                            value={item.remarks}
                                                            onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                                                            className="min-w-[150px] bg-slate-800 border-slate-700 text-white h-9"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-500 italic">{item.remarks || '-'}</span>
                                                    )}
                                                </td>
                                                {isEditMode && (
                                                    <td className="px-4 py-3 text-center">
                                                        <Button
                                                            onClick={() => handleRemoveItem(index)}
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
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <User className="h-5 w-5 text-brand" />
                                Party Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Name</p>
                                {isEditMode ? (
                                    <Input
                                        value={editableSupplier.partyName}
                                        onChange={(e) => {
                                            setEditableSupplier({ ...editableSupplier, partyName: e.target.value })
                                            setHasChanges(true)
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{editableSupplier.partyName}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Address</p>
                                {isEditMode ? (
                                    <>
                                        <Input
                                            value={editableSupplier.addressLine1}
                                            onChange={(e) => {
                                                setEditableSupplier({ ...editableSupplier, addressLine1: e.target.value })
                                                setHasChanges(true)
                                            }}
                                            className="bg-slate-800 border-slate-700 text-white mb-2"
                                            placeholder="Address Line 1"
                                        />
                                        <Input
                                            value={editableSupplier.addressLine2 || ''}
                                            onChange={(e) => {
                                                setEditableSupplier({ ...editableSupplier, addressLine2: e.target.value })
                                                setHasChanges(true)
                                            }}
                                            className="bg-slate-800 border-slate-700 text-white"
                                            placeholder="Address Line 2"
                                        />
                                    </>
                                ) : (
                                    <p className="text-white text-sm">
                                        {editableSupplier.addressLine1}
                                        {editableSupplier.addressLine2 && <>, {editableSupplier.addressLine2}</>}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">City</p>
                                    {isEditMode ? (
                                        <Input
                                            value={editableSupplier.city}
                                            onChange={(e) => {
                                                setEditableSupplier({ ...editableSupplier, city: e.target.value })
                                                setHasChanges(true)
                                            }}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    ) : (
                                        <p className="text-white text-sm">{editableSupplier.city}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">State</p>
                                    {isEditMode ? (
                                        <Input
                                            value={editableSupplier.state}
                                            onChange={(e) => {
                                                setEditableSupplier({ ...editableSupplier, state: e.target.value })
                                                setHasChanges(true)
                                            }}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    ) : (
                                        <p className="text-white text-sm">{editableSupplier.state}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Pincode</p>
                                {isEditMode ? (
                                    <Input
                                        type="number"
                                        value={editableSupplier.pinCode}
                                        onChange={(e) => {
                                            setEditableSupplier({ ...editableSupplier, pinCode: parseInt(e.target.value) })
                                            setHasChanges(true)
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{editableSupplier.pinCode}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-brand" />
                                Metadata
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
        </div>
    )
}
