"use client"

import React, { useCallback, useMemo, useState, useRef } from "react"
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

// Types definitions should ideally be shared
interface FilterModel {
    [key: string]: { filterType: string, type: string, filter: string }
}

interface SortModel {
    colId: string;
    sort: 'asc' | 'desc';
}

export default function DCGrid() {
    // Grid State
    const gridRef = useRef<AgGridReact>(null)
    const [gridApi, setGridApi] = useState<GridApi | null>(null)
    const [columnApi, setColumnApi] = useState<any>(null)

    // Data State
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeView, setActiveView] = useState("All DC")

    const [sortModel, setSortModel] = useState<SortModel[]>([])
    const [filterModel, setFilterModel] = useState<FilterModel>({})

    // Fetch Data
    const { data, isLoading } = useQuery({
        queryKey: ['dc-list', page, pageSize, searchTerm, sortModel, filterModel],
        queryFn: async () => {
            const res = await fetch('/api/dc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startRow: page * pageSize,
                    endRow: (page + 1) * pageSize,
                    search: searchTerm,
                    sortModel,
                    filterModel
                })
            })
            if (!res.ok) throw new Error('Network response was not ok')
            return res.json()
        },
        placeholderData: (previousData) => previousData
    })

    // Updated ColDefs with Pinned Columns
    const [colDefs] = useState<ColDef[]>([
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
            field: "dcNumber",
            headerName: "DC Number",
            pinned: "left", // Pinned Left
            lockPinned: true,
            width: 140,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            cellClass: "font-medium text-slate-200"
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
    ]);

    // Grid Options
    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        suppressMovable: false,
        // menuTabs: ['filterMenuTab', 'generalMenuTab'], // REMOVED to fix error #200 (requires Enterprise)
        headerClass: "ag-header-cell-custom cursor-move", // Added cursor-move
        cellClass: "ag-cell-custom",
    }), []);


    // Event Handlers
    const onGridReady = useCallback((params: GridReadyEvent) => {
        setGridApi(params.api)
        // columnApi is deprecated/removed in v31+, access via api
        // setColumnApi(params.columnApi)
    }, []);

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
        <div className="flex flex-col h-full bg-[#0B1120] text-slate-200">
            <GridHeader
                activeView={activeView}
                onViewChange={setActiveView}
                onSearch={(term) => {
                    setSearchTerm(term)
                    setPage(0)
                }}
                totalCount={totalCount}
            />

            <div className="flex-1 relative border border-slate-800 rounded-md overflow-hidden bg-[#111827]">
                <div className="ag-theme-balham-dark h-full w-full custom-ag-grid">
                    <AgGridReact
                        theme="legacy" // Fix error #239
                        ref={gridRef}
                        rowData={data?.rowData || []}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="multiple"
                        animateRows={true}
                        onGridReady={onGridReady}
                        onSortChanged={onSortChanged}
                        onFilterChanged={onFilterChanged}
                        suppressPaginationPanel={true}
                        tooltipShowDelay={0}
                        getRowId={(params) => params.data.id}
                        overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading DCs...</span>'
                        popupParent={typeof document !== 'undefined' ? document.body : undefined} // Fix: Dialogs render outside grid container
                    />
                </div>
            </div>

            {/* Custom Pagination Footer */}
            <div className="h-12 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between px-4 z-10 relative">
                <div className="text-xs text-slate-500">
                    Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} DCs
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={page === 0 || isLoading}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-slate-400 font-medium px-2">
                        {page + 1} / {totalPages || 1}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={page >= totalPages - 1 || isLoading}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Injected Styles for AG Grid Customization */}
            <style jsx global>{`
                .ag-theme-balham-dark {
                    /* Variable overrides for dark theme */
                    --ag-background-color: #0F172A; /* Darker background */
                    --ag-foreground-color: #94a3b8;
                    --ag-border-color: #1e293b;
                    --ag-header-background-color: #0F172A;
                    --ag-header-height: 48px;
                    --ag-row-height: 48px;
                    --ag-row-hover-color: #1e293b;
                    --ag-selected-row-background-color: rgba(16, 185, 129, 0.08);
                    --ag-odd-row-background-color: #131b2e; /* Subtle Zebra Stripe */
                    --ag-header-column-separator-display: none; /* Cleaner look without separators */
                    
                    /* Typography */
                    --ag-font-family: inherit;
                    --ag-font-size: 13px;
                }
                /* Ensures popups/menus attached to body also get the theme */
                :global(.ag-theme-balham-dark) {
                     --ag-background-color: #0F172A;
                     --ag-foreground-color: #cbd5e1;
                     --ag-border-color: #1e293b;
                }
                .custom-ag-grid {
                    height: 100%;
                    width: 100%;
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
                    color: #e2e8f0; /* Highlight header on hover */
                }
                .ag-cell-custom {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #1e293b; /* Explicit row borders */
                }
                /* Remove default outer border */
                .ag-root-wrapper {
                     border: none !important;
                }
                /* Sticky column refined styles */
                .ag-pinned-left-header, .ag-pinned-left-cols-container {
                     border-right: 1px solid #334155;
                     box-shadow: 4px 0 12px -4px rgba(0,0,0,0.3);
                     /* z-index: 20; Removed to prevent stacking context fight with popups */
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
        </div>
    )
}
