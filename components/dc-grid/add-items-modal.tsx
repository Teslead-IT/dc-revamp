"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchDraftDCItems } from "@/hooks/use-draft-dc-items"

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

interface AddItemsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (items: ItemRow[]) => void
    enableWeight: boolean
    enableSqft: boolean
    initialItems?: ItemRow[] // Optional initial items for editing
    mode?: 'add' | 'update' | 'view' // Mode: add new items or update existing items or view only
}

export function AddItemsModal({
    open,
    onOpenChange,
    onConfirm,
    enableWeight,
    enableSqft,
    initialItems = [],
    mode = 'add'
}: AddItemsModalProps) {
    const { toast } = useToast()
    const [items, setItems] = useState<ItemRow[]>([{
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
    const [expandedItemId, setExpandedItemId] = useState<number>(1)

    // Autosuggestion state
    const [itemNameSearch, setItemNameSearch] = useState<Record<number, string>>({})
    const [showSuggestions, setShowSuggestions] = useState<Record<number, boolean>>({})
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')
    const [activeSuggestionItemId, setActiveSuggestionItemId] = useState<number | null>(null)
    const suggestionRefs = useRef<Record<number, HTMLDivElement | null>>({})

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            if (activeSuggestionItemId) {
                const searchTerm = itemNameSearch[activeSuggestionItemId] || ''
                setDebouncedSearch(searchTerm)
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(handler)
    }, [itemNameSearch, activeSuggestionItemId])

    // Fetch suggestions
    const { data: suggestions, isLoading: suggestionsLoading } = useSearchDraftDCItems(
        debouncedSearch,
        !!activeSuggestionItemId && !!debouncedSearch && mode !== 'view'
    )

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            Object.entries(suggestionRefs.current).forEach(([itemId, ref]) => {
                if (ref && !ref.contains(event.target as Node)) {
                    setShowSuggestions(prev => ({ ...prev, [itemId]: false }))
                }
            })
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Reset items when modal opens
    useEffect(() => {
        if (open) {
            if ((mode === 'update' || mode === 'view') && initialItems.length > 0) {
                // Use the provided initial items
                setItems(initialItems)
                setExpandedItemId(initialItems[0].id)
            } else {
                // Create a new empty item
                const newItem = {
                    id: Date.now(), // Use timestamp for unique ID
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
                }
                setItems([newItem])
                setExpandedItemId(newItem.id)
            }
        }
    }, [open]) // Only depend on 'open' to prevent infinite loops

    const addRow = () => {
        if (mode === 'view') return
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
        const newItem = {
            id: newId,
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
        }
        setItems([...items, newItem])
        setExpandedItemId(newId) // Auto-expand new item
    }

    const removeRow = (id: number) => {
        if (mode === 'view') return
        if (items.length > 1) {
            const filtered = items.filter(item => item.id !== id)
            setItems(filtered)
            // If we removed the expanded item, expand the first one
            if (expandedItemId === id && filtered.length > 0) {
                setExpandedItemId(filtered[0].id)
            }
        }
    }

    const handleChange = (id: number, field: keyof ItemRow, value: string) => {
        if (mode === 'view') return
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value }
            }
            return item
        }))
    }

    // Handle item name input with autosuggestion
    const handleItemNameChange = (id: number, value: string) => {
        if (mode === 'view') return
        // Update the item value
        handleChange(id, 'itemName', value)

        // Update search state
        setItemNameSearch(prev => ({ ...prev, [id]: value }))
        setActiveSuggestionItemId(id)

        // Show/hide suggestions based on input length
        if (value.length >= 2) {
            setShowSuggestions(prev => ({ ...prev, [id]: true }))
        } else {
            setShowSuggestions(prev => ({ ...prev, [id]: false }))
        }
    }

    // Handle suggestion selection
    const handleSuggestionSelect = (id: number, itemName: string) => {
        if (mode === 'view') return
        handleChange(id, 'itemName', itemName)
        setItemNameSearch(prev => ({ ...prev, [id]: itemName }))
        setShowSuggestions(prev => ({ ...prev, [id]: false }))
        setActiveSuggestionItemId(null)
    }

    const toggleExpand = (id: number) => {
        setExpandedItemId(expandedItemId === id ? 0 : id)
    }

    // Check if the last item has required fields filled
    const canAddNewItem = () => {
        if (mode === 'view') return false
        if (items.length === 0) return true
        const lastItem = items[items.length - 1]

        // Basic mandatory fields
        const isBasicValid = lastItem.itemName.trim() !== "" &&
            lastItem.quantity.trim() !== "" &&
            lastItem.uom.trim() !== "" &&
            lastItem.description.trim() !== "" &&
            lastItem.projectName.trim() !== "" &&
            lastItem.projectIncharge.trim() !== "" &&
            lastItem.rate.trim() !== "" &&
            lastItem.remarks.trim() !== "" &&
            lastItem.notes.trim() !== ""

        // Weight validation if enabled
        const isWeightValid = !enableWeight || (
            lastItem.weightPerUnit.trim() !== "" &&
            lastItem.totalWeight.trim() !== ""
        )

        // SqFt validation if enabled
        const isSqftValid = !enableSqft || (
            lastItem.sqftPerUnit.trim() !== "" &&
            lastItem.totalSqft.trim() !== ""
        )

        return isBasicValid && isWeightValid && isSqftValid
    }

    // Check for duplicate item names
    const hasDuplicateItems = () => {
        if (mode === 'view') return false
        const itemNames = items.map(item => item.itemName.trim().toLowerCase()).filter(name => name !== '')
        const uniqueNames = new Set(itemNames)
        return itemNames.length !== uniqueNames.size
    }

    const handleConfirm = () => {
        if (mode === 'view') {
            onOpenChange(false)
            return
        }
        // Check for duplicates first
        if (hasDuplicateItems()) {
            toast({
                variant: "destructive",
                title: "Duplicate Items Found",
                description: "Please ensure all item names are unique. Remove or rename duplicate items.",
            })
            return
        }

        // Validate all items
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const isBasicValid = item.itemName.trim() !== "" &&
                item.quantity.trim() !== "" &&
                item.uom.trim() !== "" &&
                item.description.trim() !== "" &&
                item.projectName.trim() !== "" &&
                item.projectIncharge.trim() !== "" &&
                item.rate.trim() !== "" &&
                item.remarks.trim() !== "" &&
                item.notes.trim() !== ""

            const isWeightValid = !enableWeight || (
                item.weightPerUnit.trim() !== "" &&
                item.totalWeight.trim() !== ""
            )

            const isSqftValid = !enableSqft || (
                item.sqftPerUnit.trim() !== "" &&
                item.totalSqft.trim() !== ""
            )

            if (!isBasicValid || !isWeightValid || !isSqftValid) {
                toast({
                    variant: "destructive",
                    title: "Missing Required Fields",
                    description: `Please fill all required fields for Item #${i + 1}`,
                })
                setExpandedItemId(item.id)
                return
            }
        }

        onConfirm(items)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0F172A] border-slate-700 text-slate-100 w-[80vw] max-w-[80vw] h-[90vh] flex flex-col p-0 shadow-2xl shadow-black/50 gap-0 sm:max-w-[80vw] [&>button]:text-white [&>button]:bg-slate-800/50 [&>button]:hover:bg-slate-700 [&>button]:z-50 [&>button]:h-8 [&>button]:w-8 [&>button]:rounded-full [&>button]:top-4 [&>button]:right-4 [&>button]:flex [&>button]:items-center [&>button]:justify-center" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="p-6 pb-4 border-b border-slate-800 shrink-0">
                    <DialogTitle className="text-2xl text-white font-bold ml-1">
                        {mode === 'update' ? 'Update Items' : mode === 'view' ? 'View Items' : 'Add Items'}
                    </DialogTitle>
                    {mode !== 'view' && (
                        <div className="mt-2 bg-blue-900/20 border border-blue-900/50 text-blue-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            Please complete all fields for the current item before adding a new one.
                        </div>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.map((item, index) => {
                        const isExpanded = expandedItemId === item.id
                        return (
                            <div key={item.id} className={`border border-slate-700 rounded-lg bg-slate-900/40 overflow-hidden transition-all duration-300 ${isExpanded ? 'border-brand/30 shadow-lg shadow-black/20' : 'hover:border-slate-600'}`}>
                                {/* Item Header - Accordion Toggle */}
                                {/* Item Header - Accordion Toggle */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggleExpand(item.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            toggleExpand(item.id)
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between p-4 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${isExpanded ? 'bg-brand text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <h3 className={`text-base font-semibold transition-colors ${isExpanded ? 'text-white' : 'text-slate-300'}`}>
                                                {item.itemName || `Item #${index + 1}`}
                                            </h3>
                                            {item.itemName && <span className="text-xs text-slate-500">Click to {isExpanded ? 'collapse' : 'expand'} details</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {items.length > 1 && mode !== 'view' && (
                                            <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeRow(item.id)
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1.5" />
                                                <span className="text-xs font-medium">Remove</span>
                                            </Button>
                                        )}
                                        <div className={`p-1 rounded-full transition-transform duration-300 ${isExpanded ? 'bg-brand/20 rotate-180' : ''}`}>
                                            <ChevronDown className={`h-5 w-5 transition-colors ${isExpanded ? 'text-brand' : 'text-slate-500'}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Item Details - Collapsible with Grid Animation */}
                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-2 border-t border-slate-700/50 bg-slate-900/20">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
                                                {/* Row 1: Basic Info */}
                                                <div className="md:col-span-6 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">
                                                        Item Name <span className="text-red-400">*</span>
                                                        {(() => {
                                                            const isDuplicate = mode !== 'view' && items.filter(i => i.itemName.trim().toLowerCase() === item.itemName.trim().toLowerCase() && item.itemName.trim() !== '').length > 1
                                                            return isDuplicate && (
                                                                <span className="ml-2 text-xs text-red-400 font-normal normal-case">(Duplicate)</span>
                                                            )
                                                        })()}
                                                    </Label>
                                                    <div className="relative" ref={(el) => { suggestionRefs.current[item.id] = el }}>
                                                        <Input
                                                            disabled={mode === 'view'}
                                                            value={item.itemName}
                                                            onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                                                            onFocus={() => {
                                                                if (mode !== 'view' && item.itemName.length >= 2) {
                                                                    setShowSuggestions(prev => ({ ...prev, [item.id]: true }))
                                                                    setActiveSuggestionItemId(item.id)
                                                                }
                                                            }}
                                                            className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 h-10 transition-colors ${items.filter(i => i.itemName.trim().toLowerCase() === item.itemName.trim().toLowerCase() && item.itemName.trim() !== '').length > 1 && mode !== 'view'
                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                : 'focus:ring-brand focus:border-brand'
                                                                } ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                            placeholder="e.g. Steel Pipe 20mm"
                                                            autoComplete="off"
                                                        />

                                                        {/* Autosuggestion Dropdown */}
                                                        {showSuggestions[item.id] && mode !== 'view' && (suggestionsLoading || (suggestions && suggestions.length > 0)) && (
                                                            <div className="absolute z-50 w-full mt-1 bg-[#1e293b] border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                                                                {suggestionsLoading && activeSuggestionItemId === item.id ? (
                                                                    <div className="flex items-center justify-center py-6">
                                                                        <Loader2 className="h-5 w-5 animate-spin text-brand" />
                                                                        <span className="ml-2 text-sm text-slate-300">Searching...</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="max-h-60 overflow-y-auto py-1">
                                                                        {suggestions?.map((suggestion: any, idx: number) => (
                                                                            <button
                                                                                key={suggestion.id || idx}
                                                                                type="button"
                                                                                onClick={() => handleSuggestionSelect(item.id, suggestion.itemName)}
                                                                                className="w-full px-4 py-3 text-left hover:bg-slate-800/80 transition-colors duration-150 border-b border-slate-800/50 last:border-b-0 group"
                                                                            >
                                                                                <div className="font-medium text-slate-200 group-hover:text-white transition-colors text-sm truncate">
                                                                                    {suggestion.itemName}
                                                                                </div>
                                                                                {suggestion.itemDescription && (
                                                                                    <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors mt-0.5 truncate">
                                                                                        {suggestion.itemDescription}
                                                                                    </div>
                                                                                )}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="md:col-span-3 space-y-2">
                                                    <Label className="text-slate-300  text-xs font-medium uppercase tracking-wider">UOM <span className="text-red-400">*</span></Label>
                                                    {mode === 'view' ? (
                                                        <Input
                                                            disabled
                                                            value={item.uom}
                                                            className="bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 transition-colors opacity-80 cursor-not-allowed pointer-events-auto"
                                                        />
                                                    ) : (
                                                        <Select
                                                            value={item.uom}
                                                            onValueChange={(value) => handleChange(item.id, 'uom', value)}
                                                        >
                                                            <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white focus:ring-1 w-full py-5 focus:ring-brand focus:border-brand">
                                                                <SelectValue placeholder="Select Unit" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                                <SelectItem value="KG">Kilogram (KG)</SelectItem>
                                                                <SelectItem value="NOS">Nos</SelectItem>
                                                                <SelectItem value="LTR">Litre (LTR)</SelectItem>
                                                                <SelectItem value="MTR">Metre (MTR)</SelectItem>
                                                                <SelectItem value="SQFT">Square Foot (SQFT)</SelectItem>
                                                                <SelectItem value="CUM">Cubic Metre (CUM)</SelectItem>
                                                                <SelectItem value="TON">Tonne (TON)</SelectItem>
                                                                <SelectItem value="SET">Set</SelectItem>
                                                                <SelectItem value="BAG">Bag</SelectItem>
                                                                <SelectItem value="BOX">Box</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>

                                                <div className="md:col-span-3 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Quantity <span className="text-red-400">*</span></Label>
                                                    <Input
                                                        disabled={mode === 'view'}
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleChange(item.id, 'quantity', e.target.value)}
                                                        className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 transition-colors text-right font-medium ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                        placeholder="0"
                                                    />
                                                </div>

                                                {/* Row 2: Description (Full) */}
                                                <div className="md:col-span-12 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Description <span className="text-red-400">*</span></Label>
                                                    <Textarea
                                                        disabled={mode === 'view'}
                                                        value={item.description}
                                                        onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                                        className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand min-h-[60px] resize-none transition-colors ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                        placeholder="Detailed description of the item..."
                                                        rows={2}
                                                    />
                                                </div>

                                                {/* Row 3: Project Info & Rate */}
                                                <div className="md:col-span-4 space-y-2 ">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Project Name <span className="text-red-400">*</span></Label>
                                                    <Input
                                                        disabled={mode === 'view'}
                                                        value={item.projectName}
                                                        onChange={(e) => handleChange(item.id, 'projectName', e.target.value)}
                                                        className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 transition-colors ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                    />
                                                </div>

                                                <div className="md:col-span-4 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Project Incharge <span className="text-red-400">*</span></Label>
                                                    <Input
                                                        disabled={mode === 'view'}
                                                        value={item.projectIncharge}
                                                        onChange={(e) => handleChange(item.id, 'projectIncharge', e.target.value)}
                                                        className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 transition-colors ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                    />
                                                </div>

                                                <div className="md:col-span-4 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Rate per Unit <span className="text-red-400">*</span></Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                                        <Input
                                                            disabled={mode === 'view'}
                                                            type="number"
                                                            value={item.rate}
                                                            onChange={(e) => handleChange(item.id, 'rate', e.target.value)}
                                                            className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 pl-7 text-right transition-colors ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Row 4: Calculations (Optional) */}
                                                {(enableWeight || enableSqft) && (
                                                    <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-950/30 border border-slate-800">
                                                        {enableWeight && (
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-400 text-xs">Weight / Unit <span className="text-red-400">*</span></Label>
                                                                    <Input
                                                                        disabled={mode === 'view'}
                                                                        type="number"
                                                                        value={item.weightPerUnit}
                                                                        onChange={(e) => handleChange(item.id, 'weightPerUnit', e.target.value)}
                                                                        className={`bg-slate-900 border-slate-700 text-slate-200 h-9 text-right text-sm ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-teal-400 text-xs font-medium">Total Weight <span className="text-red-400">*</span></Label>
                                                                    <Input
                                                                        disabled={mode === 'view'}
                                                                        type="number"
                                                                        value={item.totalWeight}
                                                                        onChange={(e) => handleChange(item.id, 'totalWeight', e.target.value)}
                                                                        className={`bg-teal-950/20 border-teal-900/50 text-teal-400 h-9 text-right font-medium text-sm focus:ring-teal-500 focus:border-teal-500 ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {enableSqft && (
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-400 text-xs">Sq.Ft / Unit <span className="text-red-400">*</span></Label>
                                                                    <Input
                                                                        disabled={mode === 'view'}
                                                                        type="number"
                                                                        value={item.sqftPerUnit}
                                                                        onChange={(e) => handleChange(item.id, 'sqftPerUnit', e.target.value)}
                                                                        className={`bg-slate-900 border-slate-700 text-slate-200 h-9 text-right text-sm ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-blue-400 text-xs font-medium">Total Sq.Ft <span className="text-red-400">*</span></Label>
                                                                    <Input
                                                                        disabled={mode === 'view'}
                                                                        type="number"
                                                                        value={item.totalSqft}
                                                                        onChange={(e) => handleChange(item.id, 'totalSqft', e.target.value)}
                                                                        className={`bg-blue-950/20 border-blue-900/50 text-blue-400 h-9 text-right font-medium text-sm focus:ring-blue-500 focus:border-blue-500 ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Bottom Row: Additional Details */}
                                                <div className="md:col-span-6 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Remarks <span className="text-red-400">*</span></Label>
                                                    <Input
                                                        disabled={mode === 'view'}
                                                        value={item.remarks}
                                                        onChange={(e) => handleChange(item.id, 'remarks', e.target.value)}
                                                        className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 transition-colors ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                    />
                                                </div>
                                                <div className="md:col-span-6 space-y-2">
                                                    <Label className="text-slate-300 text-xs font-medium uppercase tracking-wider">Internal Notes <span className="text-red-400">*</span></Label>
                                                    <Input
                                                        disabled={mode === 'view'}
                                                        value={item.notes}
                                                        onChange={(e) => handleChange(item.id, 'notes', e.target.value)}
                                                        className={`bg-slate-950/50 border-slate-700 text-white focus:ring-1 focus:ring-brand focus:border-brand h-10 transition-colors ${mode === 'view' ? 'opacity-80 cursor-not-allowed pointer-events-auto' : ''}`}
                                                        placeholder="Private notes..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <DialogFooter className="p-6 border-t border-slate-800 shrink-0 flex items-center justify-between sm:justify-between w-full">
                    {/* Left Side: Add Another Item Button */}
                    <div className="flex-1">
                        {mode !== 'view' && (
                            <Button
                                type="button"
                                onClick={addRow}
                                disabled={!canAddNewItem()}
                                variant="outline"
                                className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed h-10"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Another Item
                            </Button>
                        )}
                    </div>

                    {/* Right Side: Action Buttons (Cancel Swapped) */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            {mode === 'view' ? 'Close' : 'Cancel'}
                        </Button>
                        {mode !== 'view' && (
                            <Button
                                type="button"
                                onClick={handleConfirm}
                                disabled={hasDuplicateItems()}
                                className="bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {mode === 'update' ? 'Save Changes' : 'Add Items'}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
