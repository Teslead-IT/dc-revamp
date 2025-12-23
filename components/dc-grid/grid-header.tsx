
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
        <div className="flex flex-col gap-4 mb-4">
            {/* Top Bar: Title & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-semibold text-slate-100">Delivery Challans</h1>
                    <div className="flex text-sm font-medium text-slate-400 gap-4">
                        <button className="text-brand-highlight border-b-2 border-brand-highlight pb-1 px-1">Active DCs</button>
                        <button className="hover:text-slate-200 px-1 pb-1 transition-colors">DC Templates</button>
                        <button className="hover:text-slate-200 px-1 pb-1 transition-colors">DC Groups</button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <NewDCSheet />
                </div>
            </div>

            {/* Second Bar: View & Controls */}
            <div className="flex items-center justify-between bg-[#1e293b]/50 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white gap-2 data-[state=open]:bg-slate-800">
                                {activeView}
                                <ChevronDown className="h-3 w-3 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700 text-slate-300">
                            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("All DCs")}>
                                All DCs
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => onViewChange("My DCs")}>
                                My DCs
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem className="text-brand-highlight focus:bg-slate-800 focus:text-brand-highlight cursor-pointer">
                                + Create Custom View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-5 w-px bg-slate-700 mx-1"></div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                        <Input
                            placeholder="Search..."
                            className="h-8 w-64 pl-8 bg-slate-950/50 border-slate-700 text-slate-300 focus-visible:ring-brand/50 focus-visible:border-brand placeholder:text-slate-600"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mr-2">Total: {totalCount}</span>

                    <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white hover:bg-slate-800">
                        <LayoutList className="h-4 w-4 mr-2" />
                        List
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
