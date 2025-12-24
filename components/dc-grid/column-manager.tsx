"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Columns, Eye, EyeOff } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ColumnConfig {
    field: string
    headerName: string
    type: 'text' | 'number' | 'date' | 'boolean'
    width?: number
    visible: boolean
    custom: boolean
}

interface ColumnManagerProps {
    columns: ColumnConfig[]
    onColumnsChange: (columns: ColumnConfig[]) => void
}

export function ColumnManager({ columns, onColumnsChange }: ColumnManagerProps) {
    const [open, setOpen] = useState(false)

    const toggleColumnVisibility = (field: string) => {
        onColumnsChange(
            columns.map(col =>
                col.field === field ? { ...col, visible: !col.visible } : col
            )
        )
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="h-7 px-2 text-xs bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
            >
                <Columns className="h-3.5 w-3.5" />
            </Button>

            {/* Column Manager Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#1e293b] border-slate-700 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Manage Columns</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Show or hide columns in your table.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-slate-300 font-medium">
                                {columns.filter(c => c.visible).length} of {columns.length} columns visible
                            </p>
                        </div>

                        <ScrollArea className="h-[400px] rounded-md border border-slate-600 p-4 bg-slate-900/50">
                            {columns.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <Columns className="h-12 w-12 text-slate-600 mb-3" />
                                    <p className="text-slate-400 text-sm">No columns available</p>
                                    <p className="text-slate-500 text-xs mt-1">Columns will appear here once the grid loads</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {columns.map((column) => (
                                        <div
                                            key={column.field}
                                            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 transition-colors border border-slate-700/50"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <Switch
                                                    checked={column.visible}
                                                    onCheckedChange={() => toggleColumnVisibility(column.field)}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-100">
                                                        {column.headerName}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {column.field}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {column.visible ? (
                                                    <Eye className="h-4 w-4 text-emerald-400" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-slate-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 hover:text-white"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
