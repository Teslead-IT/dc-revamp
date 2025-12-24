"use client"

import { MoreHorizontal, Eye, Edit, Trash2, Copy, ExternalLink, Archive, Mail, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionsCellProps {
    data: any;
    context: any;
}

export function ActionsCellRenderer({ data, context }: ActionsCellProps) {
    if (!data) return null;

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        context?.onDelete?.(data);
    }

    return (
        <div className="flex items-center justify-center h-full w-full">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-emerald-500 hover:bg-transparent actions-icon opacity-0 duration-200 data-[state=open]:opacity-100"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1e293b] border-slate-700 text-slate-200">
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <Eye className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <ExternalLink className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>Open in New Tab</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <Copy className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <Palette className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>Color</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <Edit className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>Edit DC</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <Mail className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>Email Alias</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                        <Archive className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        <span>Move to Archive</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                        className="focus:bg-red-900/30 focus:text-red-400 text-red-400 cursor-pointer"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Trash</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
