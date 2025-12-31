"use client"

import React, { useCallback, useMemo, useState, useRef, useEffect } from "react"
import { AgGridReact } from "ag-grid-react"
import {
    ColDef,
    GridReadyEvent,
    GridApi,
    ModuleRegistry,
    AllCommunityModule
} from "ag-grid-community"

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSuppliers, useDeleteSupplier, useUpdateSupplier } from "@/hooks/use-suppliers"
import { SupplierDeleteDialog } from "@/components/suppliers/supplier-delete-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CreateSupplierModal } from "@/components/dc-grid/create-supplier-modal"
import { useHeaderStore } from "@/hooks/use-header-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Supplier, CreateSupplierData } from "@/lib/api-client"
import { showToast as toast } from "@/lib/toast-service"

// Supplier Context Menu Component
function SupplierContextMenu({ x, y, onClose, data, onEdit, onDelete }: any) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])

    return (
        <div
            ref={ref}
            className="fixed z-[100000] w-48 overflow-hidden rounded-md border border-slate-700 bg-[#1e293b] p-1 text-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <MenuItem
                icon={Pencil}
                label="Edit Supplier"
                onClick={() => {
                    onEdit(data)
                    onClose()
                }}
            />
            <div className="my-1 h-px bg-slate-700" />
            <MenuItem
                icon={Trash2}
                label="Delete"
                className="text-red-400 focus:bg-red-900/30 hover:bg-red-900/10"
                onClick={() => {
                    onDelete(data)
                    onClose()
                }}
            />
        </div>
    )
}

function MenuItem({ icon: Icon, label, className = "", onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 hover:text-white ${className}`}
        >
            <Icon className="mr-2 h-4 w-4" />
            <span>{label}</span>
        </div>
    )
}

export default function SuppliersGrid() {
    const gridRef = useRef<AgGridReact>(null)
    const [gridApi, setGridApi] = useState<GridApi | null>(null)

    // Fetch suppliers
    const { data: suppliers = [], isLoading } = useSuppliers()
    const deleteSupplier = useDeleteSupplier()
    const updateSupplier = useUpdateSupplier()

    // Modal states
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; data: any } | null>(null)

    // Edit form state
    const [editForm, setEditForm] = useState<Partial<CreateSupplierData>>({})

    // Pagination
    const [page, setPage] = useState(0)
    const pageSize = 20

    // Set Dynamic Header
    const { setTitle, setTabs } = useHeaderStore()
    useEffect(() => {
        setTitle("Suppliers"),
            setTabs([]) // Clear tabs when navigating to dashboard

    }, [setTitle])

    const paginatedData = useMemo(() => {
        const start = page * pageSize
        const end = start + pageSize
        return suppliers.slice(start, end)
    }, [suppliers, page, pageSize])

    const totalPages = Math.ceil(suppliers.length / pageSize)

    // Column Definitions
    const colDefs = useMemo<ColDef[]>(() => [
        {
            field: "partyId",
            headerName: "Party ID",
            pinned: "left",
            lockPinned: true,
            width: 140,
            cellClass: "font-medium text-slate-200"
        },
        {
            field: "partyName",
            headerName: "Party Name",
            width: 200,
            cellClass: "font-medium text-white"
        },
        {
            field: "gstinNumber",
            headerName: "GSTIN",
            width: 180,
            cellClass: "font-mono text-slate-300"
        },
        {
            field: "city",
            headerName: "City",
            width: 150
        },
        {
            field: "state",
            headerName: "State",
            width: 150
        },
        {
            field: "pinCode",
            headerName: "Pin Code",
            width: 120
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
            cellClass: "text-blue-300"
        },
        {
            field: "phone",
            headerName: "Phone",
            width: 140,
            cellClass: "text-slate-300"
        }
    ], [])

    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        suppressMovable: false,
        headerClass: "ag-header-cell-custom cursor-move",
        cellClass: "ag-cell-custom"
    }), [])

    const onGridReady = useCallback((params: GridReadyEvent) => {
        setGridApi(params.api)
    }, [])

    const onRowClicked = useCallback((event: any) => {
        setSelectedSupplier(event.data)
        setEditForm(event.data)
        setIsEditMode(false)
        setDetailsOpen(true)
    }, [])

    const onCellContextMenu = useCallback((params: any) => {
        const event = params.event
        if (event) {
            event.preventDefault()
            setContextMenu({ x: event.clientX, y: event.clientY, data: params.data })
        }
    }, [])

    const handleEdit = useCallback((supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setEditForm(supplier)
        setIsEditMode(true)
        setDetailsOpen(true)
    }, [])

    const handleDelete = useCallback((supplier: Supplier) => {
        setDeleteTarget(supplier)
        setDeleteDialogOpen(true)
    }, [])

    const handleConfirmDelete = async () => {
        if (!deleteTarget?.partyId) return
        await deleteSupplier.mutateAsync(deleteTarget.partyId)
        setDeleteDialogOpen(false)
        setDeleteTarget(null)
        setDetailsOpen(false)
    }

    const handleSaveEdit = async () => {
        if (!selectedSupplier?.partyId) return

        try {
            await updateSupplier.mutateAsync({
                id: selectedSupplier.partyId,
                data: editForm
            })
            setIsEditMode(false)
            setDetailsOpen(false)
        } catch (error: any) {
            console.error('Failed to update supplier:', error)
        }
    }

    const handleCancelEdit = () => {
        setEditForm(selectedSupplier || {})
        setIsEditMode(false)
    }

    const handleNext = () => {
        if (page < totalPages - 1) setPage(p => p + 1)
    }

    const handlePrev = () => {
        if (page > 0) setPage(p => p - 1)
    }

    return (
        <div className="flex flex-col h-full bg-[#0B1120] text-slate-200">
            {/* Header with New Supplier button */}
            <div className="h-14 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between px-6 flex-shrink-0">
                <div className="text-xs text-slate-400">
                    {suppliers.length} total supplier{suppliers.length !== 1 ? 's' : ''}
                </div>
                <Button
                    className="bg-brand hover:bg-brand/90 text-white gap-2 h-9"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    New Supplier
                </Button>
            </div>

            {/* AG Grid */}
            <div className="flex-1 relative">
                <div className="ag-theme-balham-dark absolute inset-0 custom-ag-grid">
                    <AgGridReact
                        theme="legacy"
                        ref={gridRef}
                        rowData={paginatedData}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        onGridReady={onGridReady}
                        onRowClicked={onRowClicked}
                        onCellContextMenu={onCellContextMenu}
                        preventDefaultOnContextMenu={true}
                        suppressPaginationPanel={true}
                        getRowId={(params) => params.data.id}
                        overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading Suppliers...</span>'
                        popupParent={typeof document !== 'undefined' ? document.body : undefined}
                    />
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="h-9 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between px-3 flex-shrink-0">
                <div className="text-[10px] text-slate-500">
                    Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, suppliers.length)} of {suppliers.length} suppliers
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={page === 0 || isLoading}
                        className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-[10px] text-slate-400 font-medium px-1.5">
                        {page + 1} / {totalPages || 1}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={page >= totalPages - 1 || isLoading}
                        className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* AG Grid Styles */}
            <style jsx global>{`
                .ag-theme-balham-dark {
                    --ag-background-color: #0B1120;
                    --ag-foreground-color: #94a3b8;
                    --ag-border-color: #334155;
                    --ag-header-background-color: #0F172A;
                    --ag-header-height: 32px;
                    --ag-row-height: 34px;
                    --ag-font-size: 11px;
                    --ag-row-hover-color: #1e293b;
                    --ag-selected-row-background-color: rgba(16, 185, 129, 0.08);
                    --ag-odd-row-background-color: #131b2e;
                    --ag-header-column-separator-display: none;
                }
                
                .ag-header-cell-custom {
                    font-size: 0.70rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #64748b;
                }
                
                .ag-header-cell-custom:hover {
                    cursor: move;
                    color: #e2e8f0;
                }
                
                .ag-cell-custom {
                    display: flex;
                    align-items: center;
                    border-bottom: none !important;
                }
                
                .ag-root-wrapper {
                    border: none !important;
                }
                
                .ag-row, .ag-cell, .ag-cell-value {
                    border: none !important;
                }
            `}</style>

            {/* Context Menu */}
            {contextMenu && (
                <SupplierContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    data={contextMenu.data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Supplier Details/Edit Sheet - Redesigned */}
            <Sheet open={detailsOpen} onOpenChange={(open) => {
                if (!open) {
                    setDetailsOpen(false)
                    setIsEditMode(false)
                    setEditForm({})
                }
            }}>
                <SheetContent className="bg-[#0B1120] border-l border-slate-800 text-white w-[500px] sm:w-[600px] overflow-y-auto p-0" onInteractOutside={(e) => e.preventDefault()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-[#0B1120] z-10 border-b border-slate-800/50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEditMode ? 'Edit Supplier' : 'Supplier Details'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {selectedSupplier?.partyId}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDetailsOpen(false)}
                                className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {selectedSupplier && (
                        <div className="p-6 space-y-4">
                            {!isEditMode ? (
                                // View Mode - Modern Card Design
                                <>
                                    {/* Basic Info Card */}
                                    <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-200">Basic Information</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-500 font-medium">Party Name</label>
                                                <p className="text-sm font-semibold text-white mt-1">{selectedSupplier.partyName}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-medium">GSTIN</label>
                                                <p className="text-sm font-mono text-slate-300 mt-1">{selectedSupplier.gstinNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Card */}
                                    <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-200">Address</h3>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                                            <p>{selectedSupplier.addressLine1}</p>
                                            {selectedSupplier.addressLine2 && <p>{selectedSupplier.addressLine2}</p>}
                                            <p className="text-slate-400">
                                                {selectedSupplier.city}, {selectedSupplier.state} - {selectedSupplier.pinCode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Card */}
                                    <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-200">Contact Information</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {selectedSupplier.email && (
                                                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <div className="flex-1">
                                                        <label className="text-xs text-slate-500">Email</label>
                                                        <p className="text-sm text-blue-300">{selectedSupplier.email}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedSupplier.phone && (
                                                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <div className="flex-1">
                                                        <label className="text-xs text-slate-500">Phone</label>
                                                        <p className="text-sm text-slate-300">{selectedSupplier.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2 sticky bottom-0 bg-[#0B1120] pb-2 border-t border-slate-800/50">
                                        <Button
                                            className="flex-1 bg-slate-800 text-slate-200 cursor-pointer hover:bg-slate-700 hover:text-white border border-slate-700 h-11"
                                            onClick={() => setIsEditMode(true)}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit Supplier
                                        </Button>
                                        <Button
                                            className="bg-red-950/50 cursor-pointer text-red-400 hover:bg-red-950 hover:text-white border border-red-800 h-11 px-6"
                                            onClick={() => {
                                                setDetailsOpen(false)
                                                handleDelete(selectedSupplier)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                // Edit Mode
                                <>
                                    <div className="space-y-4">
                                        {/* Basic Info */}
                                        <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Basic Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-slate-300 text-xs">Party Name <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        value={editForm.partyName || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, partyName: e.target.value })}
                                                        className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-300 text-xs">GSTIN</Label>
                                                    <Input
                                                        value={editForm.gstinNumber || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, gstinNumber: e.target.value })}
                                                        className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Address</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-slate-300 text-xs">Address Line 1</Label>
                                                    <Input
                                                        value={editForm.addressLine1 || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })}
                                                        className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-300 text-xs">Address Line 2</Label>
                                                    <Input
                                                        value={editForm.addressLine2 || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, addressLine2: e.target.value })}
                                                        className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-slate-300 text-xs">City</Label>
                                                        <Input
                                                            value={editForm.city || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                                            className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-300 text-xs">State</Label>
                                                        <Input
                                                            value={editForm.state || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                                            className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-slate-300 text-xs">Pin Code</Label>
                                                        <Input
                                                            type="number"
                                                            value={editForm.pinCode || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, pinCode: parseInt(e.target.value) })}
                                                            className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-300 text-xs">State Code</Label>
                                                        <Input
                                                            type="number"
                                                            value={editForm.stateCode || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, stateCode: parseInt(e.target.value) })}
                                                            className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Contact Information</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-slate-300 text-xs">Email</Label>
                                                    <Input
                                                        type="email"
                                                        value={editForm.email || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                        className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-300 text-xs">Phone</Label>
                                                    <Input
                                                        value={editForm.phone || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                        className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Action Buttons */}
                                    <div className="flex gap-3 pt-4 sticky bottom-0 cursor-pointer bg-[#0B1120] pb-2 border-t border-slate-800/50">
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 h-11"
                                            onClick={handleSaveEdit}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer h-11 bg-slate-800"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <SupplierDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                supplierName={deleteTarget?.partyName}
                supplierId={deleteTarget?.partyId}
            />

            {/* Create Supplier Modal */}
            <CreateSupplierModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSupplierCreated={() => {
                    setCreateModalOpen(false)
                }}
            />
        </div>
    )
}
