
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

interface GridHeaderProps {
    onSearch: (term: string) => void;
    activeView: string;
    onViewChange: (view: string) => void;
    totalCount: number;
}

export function GridHeader({ onSearch, activeView, onViewChange, totalCount }: GridHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex items-center justify-between gap-3 mb-1.5 pt-1">
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

                {/* Filter & Settings Icons */}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-800">
                    <Filter className="h-3.5 w-3.5" />
                </Button>

                {/* New DC Button */}
                <NewDCSheet />
            </div>
        </div>
    )
}
