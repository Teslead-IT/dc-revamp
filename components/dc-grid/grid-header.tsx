
"use client"

import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    Search,
    Plus,
    LayoutList,
    Settings2,
    Filter,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { NewDCSheet } from "./new-dc-sheet"
import { ColumnManager, type ColumnConfig } from "./column-manager"

interface GridHeaderProps {
    onSearch: (term: string) => void;
    activeView: string;
    onViewChange: (view: string) => void;
    totalCount: number;
    columns?: ColumnConfig[];
    onColumnsChange?: (columns: ColumnConfig[]) => void;
}

export function GridHeader({ onSearch, activeView, onViewChange, totalCount, columns, onColumnsChange }: GridHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex items-center justify-between gap-3 mb-1.5 pt-1 px-3 md:px-10 lg:px-4 lg:py-2">
            {/* Left Side: View Dropdown (Zoho Style) */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white gap-1.5 px-2">
                            {activeView}
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700 text-slate-300" align="end">
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("All DCs")}>
                            All DCs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("My DCs")}>
                            My DCs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("Draft DCs")}>
                            Draft DCs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("Open DCs")}>
                            Open DCs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("Partial DCs")}>
                            Partial DCs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("Closed DCs")}>
                            Closed DCs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("Cancelled DCs")}>
                            Cancelled DCs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("Deleted DCs")}>
                            Deleted DCs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem className="text-brand-highlight focus:bg-slate-800 focus:text-brand-highlight cursor-pointer">
                            + Custom View
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* New DC Button */}
                <NewDCSheet />
            </div>

            {/* Right Side: Search and Column Manager */}
            <div className="flex items-center gap-2">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <Input
                        type="text"
                        placeholder="Search DCs..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="h-7 w-64 pl-7 pr-3 text-xs bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-500 focus:border-brand focus:ring-brand"
                    />
                </div>

                {/* Column Manager */}
                {columns && onColumnsChange && (
                    <ColumnManager columns={columns} onColumnsChange={onColumnsChange} />
                )}
            </div>
        </div>
    )
}
