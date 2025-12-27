"use client"

import { useState } from "react"
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
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface DCDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    itemName?: string;
}

export function DCDeleteDialog({ open, onOpenChange, onConfirm, itemName }: DCDeleteDialogProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleConfirm = async () => {
        setStatus('loading')
        try {
            await onConfirm()
            setStatus('success')
            // Auto close after showing success
            setTimeout(() => {
                onOpenChange(false)
                // Reset state after dialog closes
                setTimeout(() => setStatus('idle'), 300)
            }, 1500)
        } catch (error: any) {
            setStatus('error')
            setErrorMessage(error?.message || 'Failed to delete item')
        }
    }

    const handleClose = () => {
        if (status !== 'loading') {
            onOpenChange(false)
            // Reset state after dialog closes
            setTimeout(() => {
                setStatus('idle')
                setErrorMessage('')
            }, 300)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleClose}>
            <AlertDialogContent className="bg-[#1e293b] border-slate-700 p-0 overflow-hidden max-w-[500px] gap-0">

                {status === 'idle' && (
                    <>
                        {/* Header with Ribbon */}
                        <div className="relative pt-8 px-6 pb-2">
                            {/* Ribbon Tag */}
                            <div className="absolute top-0 left-8 bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-b-md shadow-lg z-10">
                                Trash Delivery Challan?
                            </div>

                            {/* Folded ribbon effect */}
                            <div className="absolute top-0 left-[calc(2rem-4px)] w-2 h-2 bg-emerald-800 skew-x-[-45deg] z-0"></div>

                            <AlertDialogHeader className="mt-4">
                                <AlertDialogTitle className="sr-only">Trash Delivery Challan</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-300 text-sm leading-relaxed mt-2">
                                    This action will remove all its associated modules. You can restore trashed delivery challan(s) from the Recycle Bin within 60 days.
                                    {itemName && (
                                        <span className="block mt-2 text-white font-medium">
                                            Item: {itemName}
                                        </span>
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                        </div>

                        {/* Footer Actions */}
                        <AlertDialogFooter className="p-6 pt-2 flex items-center gap-3">
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleConfirm();
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                            >
                                Trash
                            </AlertDialogAction>
                            <AlertDialogCancel className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white mt-0">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </>
                )}

                {status === 'loading' && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                        <p className="text-slate-300 text-sm">Deleting...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Success!</h3>
                        <p className="text-slate-300 text-sm text-center">
                            Delivery Challan moved to recycle bin.
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <>
                        <div className="p-12 flex flex-col items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <XCircle className="h-10 w-10 text-red-500" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Error</h3>
                            <p className="text-slate-300 text-sm text-center">
                                {errorMessage}
                            </p>
                        </div>
                        <AlertDialogFooter className="p-6 pt-2">
                            <AlertDialogCancel
                                onClick={() => {
                                    setStatus('idle')
                                    setErrorMessage('')
                                }}
                                className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white mt-0"
                            >
                                Try Again
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleClose}
                                className="bg-slate-700 hover:bg-slate-600 text-white border-0"
                            >
                                Close
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                )}

            </AlertDialogContent>
        </AlertDialog>
    )
}
