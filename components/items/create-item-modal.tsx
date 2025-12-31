"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateItem } from "@/hooks/use-items"
import { Loader2 } from "lucide-react"

interface CreateItemModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onItemCreated?: () => void
}

export function CreateItemModal({ open, onOpenChange, onItemCreated }: CreateItemModalProps) {
    const [itemName, setItemName] = useState("")
    const createItem = useCreateItem()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!itemName.trim()) {
            return
        }

        try {
            await createItem.mutateAsync({ itemName: itemName.trim() })
            setItemName("")
            onOpenChange(false)
            onItemCreated?.()
        } catch (error) {
            // Error is handled by the hook
        }
    }

    const handleClose = () => {
        if (!createItem.isPending) {
            setItemName("")
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            // Prevent closing on outside click - only allow close via X or Cancel button
            if (!open && !createItem.isPending) {
                handleClose()
            }
        }}>
            <DialogContent className="bg-[#1e293b] border-slate-700 text-white sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Item</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Add a new standard item to the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="itemName" className="text-slate-300">
                                Item Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="itemName"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="e.g., Valve-10"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                disabled={createItem.isPending}
                                autoFocus
                                required
                            />
                            <p className="text-xs text-slate-500">
                                Enter a unique name for the item. A standard ID will be automatically generated.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={createItem.isPending}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createItem.isPending || !itemName.trim()}
                            className="bg-brand hover:bg-brand/90 text-white"
                        >
                            {createItem.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Item"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
