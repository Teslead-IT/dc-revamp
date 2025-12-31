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
import { useItems, useDeleteItem, useUpdateItem, type Item } from "@/hooks/use-items"
import { ItemDeleteDialog } from "@/components/items/item-delete-dialog"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { CreateItemModal } from "@/components/items/create-item-modal"
import { useHeaderStore } from "@/hooks/use-header-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Item Context Menu Component
function ItemContextMenu({ x, y, onClose, data, onEdit, onDelete }: any) {
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
                label="Edit Item"
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

export default function ItemsGrid() {
    const gridRef = useRef<AgGridReact>(null)
    const [gridApi, setGridApi] = useState<GridApi | null>(null)

    // Pagination and search
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const pageSize = 20

    // Fetch items
    const { data: itemsResponse, isLoading } = useItems({ search, page, limit: pageSize })
    const deleteItem = useDeleteItem()
    const updateItem = useUpdateItem()

    // Modal states
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; data: any } | null>(null)

    // Edit form state
    const [editForm, setEditForm] = useState<{ itemName: string }>({ itemName: "" })

    // Set Dynamic Header
    const { setTitle, setTabs } = useHeaderStore()
    useEffect(() => {
        setTitle("Standard Items")
        setTabs([]) // Clear tabs when navigating to items
    }, [setTitle, setTabs])

    const items = itemsResponse?.data || []
    const totalItems = itemsResponse?.total || 0
    const totalPages = Math.ceil(totalItems / pageSize)

    // Column Definitions
    const colDefs = useMemo<ColDef[]>(() => [
        {
            field: "standardItemId",
            headerName: "Item ID",
            pinned: "left",
            lockPinned: true,
            width: 180,
            cellClass: "font-medium text-slate-200"
        },
        {
            field: "itemName",
            headerName: "Item Name",
            flex: 2,
            minWidth: 200,
            cellClass: "font-medium text-white"
        },
        {
            field: "createdAt",
            headerName: "Created",
            flex: 1,
            minWidth: 180,
            cellClass: "text-slate-400",
            valueFormatter: (params) => {
                if (!params.value) return ""
                return new Date(params.value).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
        },
        {
            field: "updatedAt",
            headerName: "Updated",
            flex: 1,
            minWidth: 180,
            cellClass: "text-slate-400",
            valueFormatter: (params) => {
                if (!params.value) return ""
                return new Date(params.value).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
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
        setSelectedItem(event.data)
        setEditForm({ itemName: event.data.itemName })
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

    const handleEdit = useCallback((item: Item) => {
        setSelectedItem(item)
        setEditForm({ itemName: item.itemName })
        setIsEditMode(true)
        setDetailsOpen(true)
    }, [])

    const handleDelete = useCallback((item: Item) => {
        setDeleteTarget(item)
        setDeleteDialogOpen(true)
    }, [])

    const handleConfirmDelete = async () => {
        if (!deleteTarget?.standardItemId) return
        await deleteItem.mutateAsync(deleteTarget.standardItemId)
        setDeleteDialogOpen(false)
        setDeleteTarget(null)
        setDetailsOpen(false)
    }

    const handleSaveEdit = async () => {
        if (!selectedItem?.standardItemId || !editForm.itemName.trim()) return

        try {
            await updateItem.mutateAsync({
                standardItemId: selectedItem.standardItemId,
                data: { itemName: editForm.itemName.trim() }
            })
            setIsEditMode(false)
            setDetailsOpen(false)
        } catch (error: any) {
            console.error('Failed to update item:', error)
        }
    }

    const handleCancelEdit = () => {
        setEditForm({ itemName: selectedItem?.itemName || "" })
        setIsEditMode(false)
    }

    const handleNext = () => {
        if (page < totalPages) setPage(p => p + 1)
    }

    const handlePrev = () => {
        if (page > 1) setPage(p => p - 1)
    }

    return (
        <div className="flex flex-col h-full bg-[#0B1120] text-slate-200">
            {/* Header with Search and New Item button */}
            <div className="h-14 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between px-6 flex-shrink-0 gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="text-xs text-slate-400">
                        {totalItems} total item{totalItems !== 1 ? 's' : ''}
                    </div>
                    <Input
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1) // Reset to first page on search
                        }}
                        className="max-w-xs h-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                </div>
                <Button
                    className="bg-brand hover:bg-brand/90 text-white gap-2 h-9"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    New Item
                </Button>
            </div>

            {/* AG Grid */}
            <div className="flex-1 relative">
                <div className="ag-theme-balham-dark absolute inset-0 custom-ag-grid">
                    <AgGridReact
                        theme="legacy"
                        ref={gridRef}
                        rowData={items}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        onGridReady={onGridReady}
                        onRowClicked={onRowClicked}
                        onCellContextMenu={onCellContextMenu}
                        preventDefaultOnContextMenu={true}
                        suppressPaginationPanel={true}
                        getRowId={(params) => params.data.id.toString()}
                        overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading Items...</span>'
                        popupParent={typeof document !== 'undefined' ? document.body : undefined}
                    />
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="h-9 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between px-3 flex-shrink-0">
                <div className="text-[10px] text-slate-500">
                    Showing {items.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalItems)} of {totalItems} items
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={page === 1 || isLoading}
                        className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-[10px] text-slate-400 font-medium px-1.5">
                        {page} / {totalPages || 1}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={page >= totalPages || isLoading}
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
                <ItemContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    data={contextMenu.data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Item Details/Edit Sheet */}
            <Sheet open={detailsOpen} onOpenChange={(open) => {
                if (!open) {
                    setDetailsOpen(false)
                    setIsEditMode(false)
                    setEditForm({ itemName: "" })
                }
            }}>
                <SheetContent className="bg-[#0B1120] border-l border-slate-800 text-white w-[500px] sm:w-[600px] overflow-y-auto p-0">
                    {/* Header */}
                    <div className="sticky top-0 bg-[#0B1120] z-10 border-b border-slate-800/50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEditMode ? 'Edit Item' : 'Item Details'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {selectedItem?.standardItemId}
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

                    {selectedItem && (
                        <div className="p-6 space-y-4">
                            {!isEditMode ? (
                                // View Mode - Modern Card Design
                                <>
                                    {/* Basic Info Card */}
                                    <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-200">Item Information</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-slate-500 font-medium">Item Name</label>
                                                <p className="text-sm font-semibold text-white mt-1">{selectedItem.itemName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metadata Card */}
                                    {/* <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-200">Timestamps</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-500 font-medium">Created</label>
                                                <p className="text-sm text-slate-300 mt-1">
                                                    {new Date(selectedItem.createdAt).toLocaleString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-medium">Last Updated</label>
                                                <p className="text-sm text-slate-300 mt-1">
                                                    {new Date(selectedItem.updatedAt).toLocaleString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2 sticky bottom-0 bg-[#0B1120] pb-2 border-t border-slate-800/50">
                                        <Button
                                            className="flex-1 bg-slate-800 text-slate-200 cursor-pointer hover:bg-slate-700 hover:text-white border border-slate-700 h-11"
                                            onClick={() => setIsEditMode(true)}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit Item
                                        </Button>
                                        <Button
                                            className="bg-red-950/50 cursor-pointer text-red-400 hover:bg-red-950 hover:text-white border border-red-800 h-11 px-6"
                                            onClick={() => {
                                                setDetailsOpen(false)
                                                handleDelete(selectedItem)
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
                                        {/* Edit Form */}
                                        <div className="bg-slate-900/40 rounded-lg border border-slate-800/50 p-4 space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Edit Item Information</h3>
                                            <div>
                                                <Label className="text-slate-300 text-xs">Item Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={editForm.itemName}
                                                    onChange={(e) => setEditForm({ itemName: e.target.value })}
                                                    className="bg-slate-800/50 border-slate-700 text-white mt-1.5 h-9"
                                                    placeholder="Enter item name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Action Buttons */}
                                    <div className="flex gap-3 pt-4 sticky bottom-0 cursor-pointer bg-[#0B1120] pb-2 border-t border-slate-800/50">
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 h-11"
                                            onClick={handleSaveEdit}
                                            disabled={!editForm.itemName.trim() || updateItem.isPending}
                                        >
                                            {updateItem.isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer h-11 bg-slate-800"
                                            disabled={updateItem.isPending}
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
            <ItemDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.itemName}
                itemId={deleteTarget?.standardItemId}
            />

            {/* Create Item Modal */}
            <CreateItemModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onItemCreated={() => {
                    setCreateModalOpen(false)
                }}
            />
        </div>
    )
}
