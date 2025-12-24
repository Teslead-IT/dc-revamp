"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DCDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DCDeleteDialog({ open, onOpenChange, onConfirm }: DCDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#1e293b] border-slate-700 p-0 overflow-hidden max-w-[500px] gap-0">

                {/* Header with Ribbon */}
                <div className="relative pt-8 px-6 pb-2">
                    {/* Ribbon Tag */}
                    <div className="absolute top-0 left-8 bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-b-md shadow-lg z-10">
                        Trash Delivery Challan?
                    </div>

                    {/* Folded ribbon effect (optional visual flair) */}
                    <div className="absolute top-0 left-[calc(2rem-4px)] w-2 h-2 bg-emerald-800 skew-x-[-45deg] z-0"></div>

                    <AlertDialogHeader className="mt-4">
                        <AlertDialogTitle className="sr-only">Trash Delivery Challan</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-300 text-sm leading-relaxed mt-2">
                            This action will remove all its associated modules. You can restore trashed delivery challan(s) from the Recycle Bin within 60 days.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                {/* Footer Actions */}
                <AlertDialogFooter className="p-6 pt-2 flex items-center gap-3">
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                    >
                        Trash
                    </AlertDialogAction>
                    <AlertDialogCancel className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white mt-0">
                        Cancel
                    </AlertDialogCancel>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    )
}
