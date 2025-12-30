"use client"

import React, { useCallback, useMemo, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { useQuery } from "@tanstack/react-query"
import { StatusCellRenderer } from "./cell-renderers/status-cell"
import { OwnerCellRenderer } from "./cell-renderers/owner-cell"
import { GridHeader } from "./grid-header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ActionsCellRenderer } from "./cell-renderers/actions-cell"
import { DCContextMenu } from "./dc-context-menu"
import { useHeaderStore } from "@/hooks/use-header-store"
import { DCDeleteDialog } from "./dc-delete-dialog"
import type { ColumnConfig } from "./column-manager"
import { useDraftDCs, useDraftDCDetails, useDeleteDraftDC } from "@/hooks/use-draft-dc"

// Types definitions should ideally be shared
interface FilterModel {
    [key: string]: { filterType: string, type: string, filter: string }
}

interface SortModel {
    colId: string;
    sort: 'asc' | 'desc';
}


export default function DCGrid() {
    const router = useRouter()
    const deleteDraftDC = useDeleteDraftDC()

    // Grid State
    const gridRef = useRef<AgGridReact>(null)
    const [gridApi, setGridApi] = useState<GridApi | null>(null)
    const [columnApi, setColumnApi] = useState<any>(null)

    // Data State
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [searchTerm, setSearchTerm] = useState("")

    // Load activeView from localStorage on mount
    const [activeView, setActiveView] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('dc-grid-active-view') || 'All'
        }
        return 'All'
    })

    const [sortModel, setSortModel] = useState<SortModel[]>([])
    const [filterModel, setFilterModel] = useState<FilterModel>({})

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; data: any } | null>(null)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<any>(null)

    // Column configuration state
    const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([])

    // Save activeView to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('dc-grid-active-view', activeView)
        }
    }, [activeView])



    const handleTrashClick = (item: any) => {
        setDeleteTarget(item)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTarget?.draftId) {
            throw new Error('No draft ID found')
        }

        // Use the actual delete hook
        await deleteDraftDC.mutateAsync(deleteTarget.draftId)

        setDeleteDialogOpen(false)
        setDeleteTarget(null)
    }

    // Fetch Draft DCs with pagination
    const { data: draftDetailsData, isLoading: isDraftLoading } = useDraftDCDetails(
        page + 1, // API uses 1-indexed pages
        pageSize,
        activeView === 'Draft'
    )

    // Fetch Regular DCs (DISABLED - API not implemented yet)
    // When the /api/dc endpoint is ready, enable this query
    const { data: regularData, isLoading: isRegularLoading } = useQuery({
        queryKey: ['dc-list', page, pageSize, searchTerm, sortModel, filterModel, activeView, deleteTarget],
        queryFn: async () => {
            // This endpoint doesn't exist yet - returning empty data
            return { rowData: [], lastRow: 0, rowCount: 0 }
        },
        enabled: false, // DISABLED to prevent 404 errors
        placeholderData: (previousData: any) => previousData
    })

    // Combine data based on activeView
    const data = activeView === 'Draft'
        ? { rowData: draftDetailsData?.data || [], lastRow: draftDetailsData?.meta?.total || 0, rowCount: draftDetailsData?.meta?.total || 0 }
        : (regularData || { rowData: [], lastRow: 0, rowCount: 0 })
    const isLoading = activeView === 'Draft' ? isDraftLoading : isRegularLoading

    // Set Dynamic Header
    const { setTitle, setTabs } = useHeaderStore()
    useEffect(() => {
        setTitle("Delivery Challans")
        setTabs([
            { label: "Active DCs", value: "active" },
            { label: "DC Templates", value: "templates" },
            { label: "DC Groups", value: "groups" }
        ])
    }, [setTitle, setTabs])

    // Initialize column configs on grid ready
    useEffect(() => {
        if (gridApi && columnConfigs.length === 0) {
            const cols = gridApi.getColumns() || []
            const configs: ColumnConfig[] = cols
                .filter((col: any) => col.getColId() !== 'actions')
                .map((col: any) => ({
                    field: col.getColId(),
                    headerName: col.getColDef().headerName || col.getColId(),
                    type: 'text',
                    width: col.getActualWidth(),
                    visible: col.isVisible(),
                    custom: false
                }))

            // Load saved custom columns
            const saved = localStorage.getItem('dcGridColumnConfigs')
            if (saved) {
                try {
                    const savedConfigs: ColumnConfig[] = JSON.parse(saved)
                    const customCols = savedConfigs.filter(c => c.custom)
                    setColumnConfigs([...configs, ...customCols])
                } catch (e) {
                    setColumnConfigs(configs)
                }
            } else {
                setColumnConfigs(configs)
            }
        }
    }, [gridApi, columnConfigs.length])

    // Handle column config changes
    const handleColumnConfigsChange = useCallback((newConfigs: ColumnConfig[]) => {
        setColumnConfigs(newConfigs)
        localStorage.setItem('dcGridColumnConfigs', JSON.stringify(newConfigs))

        // Apply column visibility
        if (gridApi) {
            newConfigs.forEach(config => {
                const col = gridApi.getColumn(config.field)
                if (col) {
                    gridApi.setColumnsVisible([config.field], config.visible)
                }
            })
        }
    }, [gridApi])

    // Updated ColDefs with Pinned Columns
    const colDefs = useMemo<ColDef[]>(() => {
        // Draft DC Columns
        if (activeView === 'Draft') {
            return [
                {
                    field: "actions",
                    headerName: "",
                    cellRenderer: ActionsCellRenderer,
                    pinned: "left",
                    lockPinned: true,
                    width: 50,
                    cellClass: "flex items-center justify-center p-0",
                    suppressHeaderMenuButton: true,
                    suppressMovable: true,
                    lockPosition: "left",
                    resizable: false,
                    sortable: false,
                    filter: false
                },
                {
                    field: "draftId",
                    headerName: "Draft ID",
                    pinned: "left",
                    lockPinned: true,
                    width: 140,
                    cellClass: "font-medium text-slate-200"
                },
                {
                    field: "partyDetails.partyName",
                    headerName: "Party Name",
                    valueGetter: (params) => params.data?.partyDetails?.partyName || 'N/A',
                    width: 180
                },
                {
                    field: "process",
                    headerName: "Process",
                    width: 150
                },
                {
                    field: "dcDate",
                    headerName: "Date",
                    valueFormatter: (params) => {
                        if (!params.value) return ""
                        return new Date(params.value).toLocaleDateString()
                    },
                    width: 130
                },
                {
                    field: "dcType",
                    headerName: "Department",
                    width: 120
                },
                {
                    field: "draftDcItems",
                    headerName: "Total Items",
                    valueGetter: (params) => params.data?.draftDcItems?.length || 0,
                    cellRenderer: (params: any) => {
                        return (
                            <div className="flex items-center gap-2 h-full w-full">
                                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
                                    {params.value} Items
                                </span>
                            </div>
                        );
                    },
                    width: 120
                },
                {
                    field: "draftDcItems",
                    headerName: "Total Quantity",
                    valueGetter: (params) => {
                        const items = params.data?.draftDcItems || []
                        return items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
                    },
                    width: 140
                },
                {
                    field: "vehicleNo",
                    headerName: "Vehicle No",
                    width: 140
                },
                {
                    field: "draftDcItems",
                    headerName: "Incharge",
                    valueGetter: (params) => {
                        const items = params.data?.draftDcItems || []
                        const incharges = items
                            .map((item: any) => item.projectIncharge)
                            .filter((name: string) => name && name.trim())
                        // Remove duplicates and join with comma
                        const uniqueIncharges = [...new Set(incharges)]
                        return uniqueIncharges.join(', ') || 'N/A'
                    },
                    width: 180
                }
            ]
        }

        // Regular DC Columns
        return [
            {
                field: "actions",
                headerName: "",
                cellRenderer: ActionsCellRenderer,
                pinned: "left",
                lockPinned: true,
                width: 50,
                cellClass: "flex items-center justify-center p-0 ",
                suppressHeaderMenuButton: true,
                suppressMovable: true,
                lockPosition: "left",
                resizable: false,
                sortable: false,
                filter: false
            },
            {
                field: "dcNumber",
                headerName: "DC Number",
                pinned: "left", // Pinned Left
                lockPinned: true,
                width: 140,
                cellClass: "font-medium text-slate-200"
            },
            {
                field: "status",
                headerName: "Status",
                cellRenderer: StatusCellRenderer,
                width: 130,
                pinned: "left", // Pinned Left
                lockPinned: true, // Prevent unpinning logic if desired, keeping it simple
                cellClass: "flex items-center"
            },
            {
                field: "dispatchDate",
                headerName: "Dispatch Date",
                valueFormatter: (params) => {
                    if (!params.value) return ""
                    return new Date(params.value).toLocaleDateString()
                },
                width: 130
            },
            {
                field: "expectedReturnDate",
                headerName: "Return Date",
                valueFormatter: (params) => {
                    if (!params.value) return ""
                    const date = new Date(params.value)
                    const now = new Date()
                    const diffTime = date.getTime() - now.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return `${date.toLocaleDateString()} (${diffDays} days)`
                },
                cellClass: (params) => {
                    return "text-slate-300"
                },
                width: 180
            },
            {
                field: "itemsCount",
                headerName: "Items",
                cellRenderer: (params: any) => {
                    return (
                        <div className="flex items-center gap-2 h-full w-full">
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
                                {params.value} Items
                            </span>
                        </div>
                    );
                },
                width: 120
            },
            {
                field: "customerName",
                headerName: "Customer",
                width: 180
            },
            {
                field: "priority",
                headerName: "Priority",
                width: 110,
            },
            {
                field: "createdBy",
                headerName: "Created By",
                cellRenderer: OwnerCellRenderer,
                width: 180
            },
            {
                field: "totalValue",
                headerName: "Value",
                valueFormatter: (params) => {
                    return params.value ? `₹ ${params.value.toLocaleString()} /-` : ""
                }
            }
        ]
    }, [activeView])

    // Grid Options
    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        suppressMovable: false,
        headerClass: "ag-header-cell-custom cursor-move", // Added cursor-move
        cellClass: "ag-cell-custom",
        valueFormatter: (params) => {
            // Default formatter for objects
            if (params.value != null && typeof params.value === 'object') {
                return JSON.stringify(params.value)
            }
            return params.value
        }
    }), []);


    // Event Handlers
    const onGridReady = useCallback((params: GridReadyEvent) => {
        setGridApi(params.api)
        // columnApi is deprecated/removed in v31+, access via api
        // setColumnApi(params.columnApi)
    }, []);

    const onRowClicked = useCallback((event: any) => {
        // Only navigate for Draft DCs
        if (activeView === 'Draft' && event.data?.draftId) {
            router.push(`/dashboard/dc/draft/${event.data.draftId}`)
        }
    }, [activeView, router])


    const onSortChanged = useCallback((e: any) => {
        // Use the event api if available, otherwise fallback to state
        const api = e.api || gridApi;
        if (api) {
            const newSortModel = api.getSortModel();
            if (JSON.stringify(newSortModel) !== JSON.stringify(sortModel)) {
                setSortModel(newSortModel);
            }
        }
    }, [sortModel, gridApi]);

    const onFilterChanged = useCallback((e: any) => {
        const api = e.api || gridApi;
        if (api) {
            const newFilterModel = api.getFilterModel();
            if (JSON.stringify(newFilterModel) !== JSON.stringify(filterModel)) {
                setFilterModel(newFilterModel);
            }
        }
    }, [filterModel, gridApi]);

    const onCellContextMenu = useCallback((params: any) => {
        const event = params.event;
        if (event) {
            event.preventDefault();
            setContextMenu({ x: event.clientX, y: event.clientY, data: params.data });
        }
    }, []);


    // Pagination Controls
    const totalCount = data?.rowCount || 0
    const totalPages = Math.ceil(totalCount / pageSize)

    const handleNext = () => {
        if (page < totalPages - 1) setPage(p => p + 1)
    }
    const handlePrev = () => {
        if (page > 0) setPage(p => p - 1)
    }

    return (
        // <div className="flex flex-col h-full bg-[#202124] text-slate-200">
        <div className="flex flex-col h-full bg-[#0B1120] text-slate-200">

            <GridHeader
                activeView={activeView}
                onViewChange={setActiveView}
                onSearch={(term) => {
                    setSearchTerm(term)
                    setPage(0)
                }}
                totalCount={totalCount}
                columns={columnConfigs}
                onColumnsChange={handleColumnConfigsChange}
            />

            <div className="flex-1 relative">
                <div className="ag-theme-balham-dark absolute inset-0 custom-ag-grid">
                    <AgGridReact
                        theme="legacy" // Fix error #239
                        ref={gridRef}
                        rowData={data?.rowData || []}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        // rowSelection="multiple" REMOVED
                        animateRows={true}
                        onGridReady={onGridReady}
                        onRowClicked={onRowClicked}
                        onSortChanged={onSortChanged}
                        onFilterChanged={onFilterChanged}
                        onCellContextMenu={onCellContextMenu}
                        preventDefaultOnContextMenu={true}
                        suppressPaginationPanel={true}
                        tooltipShowDelay={0}
                        getRowId={(params) => params.data.id}
                        overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading DCs...</span>'
                        popupParent={typeof document !== 'undefined' ? document.body : undefined} // Fix: Dialogs render outside grid container
                        context={{ onDelete: handleTrashClick }}
                    />
                </div>
            </div>

            {/* Old context menu removed from here */}

            {/* Custom Pagination Footer */}
            <div className="h-9 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between px-3 z-10 relative">
                <div className="text-[10px] text-slate-500">
                    Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} DCs
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

            {/* Injected Styles for AG Grid Customization */}
            <style jsx global>{`
                .ag-theme-balham-dark {
                    /* Variable overrides for dark theme */
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
                    border-bottom: none !important; /* Remove row borders as requested */
                }
                /* Remove default outer border from AG Grid */
                .ag-root-wrapper {
                     border: none !important;
                }
                
                /* --- CUTOUT ACTIONS COLUMN STYLES --- */
                
                /* --- GLOBAL BORDER REMOVAL FOR "CLEAN" LOOK --- */
                .ag-row, .ag-cell, .ag-cell-value, .ag-row-even, .ag-row-odd {
                    border: none !important;
                    border-bottom: none !important;
                }

                /* --- CUTOUT ACTIONS COLUMN STYLES --- */
                
                /* 1. Hide Actions Header & Cell Background/Borders (Blend with Page BG) */
                .ag-header-cell[col-id="actions"], 
                .ag-cell[col-id="actions"] {
                    background-color: #0B1120 !important; /* Page Background */
                    border: none !important;
                }

                /* Sticky column refined styles */
                .ag-pinned-left-header, .ag-pinned-left-cols-container {
                     border-right: none !important; 
                     box-shadow: none !important; 
                }

                /* Force AG Grid Popups (menus, tooltips) to be on top of everything */
                :global(.ag-popup) {
                    z-index: 99999 !important;
                }
                :global(.ag-menu) {
                     border: 1px solid #334155;
                     background-color: #0F172A;
                     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
                }
            `}</style>

            {contextMenu && (
                <DCContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    data={contextMenu.data}
                    onTrash={() => handleTrashClick(contextMenu.data)}
                />
            )}

            <DCDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.draftId}
            />
        </div>
    )
}
