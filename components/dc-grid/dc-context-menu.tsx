"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Copy, ExternalLink, Archive, Mail, Palette } from "lucide-react"

interface DCContextMenuProps {
    x: number
    y: number
    onClose: () => void
    data?: any
    onTrash?: () => void
}

export function DCContextMenu({ x, y, onClose, data, onTrash }: DCContextMenuProps) {
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose()
            }
        }
        // Use mousedown to close faster
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    const handleViewDetails = () => {
        if (data?.draftId) {
            router.push(`/dashboard/dc/draft/${data.draftId}`)
        }
        onClose()
    }

    return (
        <div
            ref={ref}
            className="fixed z-[100000] w-56 overflow-hidden rounded-md border border-slate-700 bg-[#1e293b] p-1 text-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()} // Prevent native menu inside custom menu
        >
            <MenuItem icon={Eye} label="View Details" onClick={handleViewDetails} />
            <MenuItem icon={ExternalLink} label="Open in New Tab" />
            <div className="my-1 h-px bg-slate-700" />
            <MenuItem icon={Copy} label="Copy Link" />
            <MenuItem icon={Palette} label="Color" />
            <div className="my-1 h-px bg-slate-700" />
            <MenuItem icon={Edit} label="Edit DC" />
            <MenuItem icon={Mail} label="Email Alias" />
            <MenuItem icon={Archive} label="Move to Archive" />
            <div className="my-1 h-px bg-slate-700" />
            <MenuItem
                icon={Trash2}
                label="Trash"
                className="text-red-400 focus:bg-red-900/30 focus:text-red-400 hover:text-red-400 hover:bg-red-900/10"
                onClick={() => {
                    onTrash?.();
                    onClose();
                }}
            />
        </div>
    )
}

function MenuItem({ icon: Icon, label, className = "", onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group ${className}`}
        >
            <Icon className="mr-2 h-4 w-4" />
            <span>{label}</span>
        </div>
    )
}
