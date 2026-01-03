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

export type DeleteDialogVariant = 'trash' | 'delete'

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description: string;
    itemName?: string;
    itemId?: string;
    variant?: DeleteDialogVariant;
    successMessage?: string;
    loadingMessage?: string;
}

export function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    itemName,
    itemId,
    variant = 'delete',
    successMessage,
    loadingMessage
}: DeleteDialogProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    // Determine colors based on variant
    const isTrash = variant === 'trash'
    const ribbonColor = isTrash ? 'bg-emerald-600' : 'bg-red-600'
    const ribbonFoldColor = isTrash ? 'bg-emerald-800' : 'bg-red-800'
    const buttonColor = isTrash ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
    const loadingColor = isTrash ? 'text-emerald-500' : 'text-red-500'
    const buttonText = isTrash ? 'Trash' : 'Delete Permanently'
    const defaultSuccessMessage = isTrash
        ? 'Item moved to recycle bin.'
        : 'Item deleted successfully.'
    const defaultLoadingMessage = isTrash ? 'Trashing...' : 'Deleting...'

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
            setErrorMessage(error?.message || 'Failed to complete action')
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
            <AlertDialogContent className="bg-[#1e293b] border-slate-700 p-0 overflow-visible max-w-[500px] gap-0">

                {status === 'idle' && (
                    <>
                        {/* Header with Ribbon */}
                        <div className="relative pt-12 px-6 pb-2">
                            {/* Ribbon Tag */}
                            <div className={`absolute -top-3 left-6 ${ribbonColor} text-white text-sm font-semibold px-6 py-2 rounded-r-md rounded-bl-md shadow-lg z-20`}>
                                {title}
                                {/* Fold Triangle */}
                                <div className={`absolute bottom-6 -left-2 w-2 h-3 ${ribbonFoldColor} [clip-path:polygon(100%_0,0_100%,100%_100%)] brightness-75`}></div>
                            </div>

                            <AlertDialogHeader className="mt-2">
                                <AlertDialogTitle className="sr-only">{title}</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-300 text-sm leading-relaxed mt-2">
                                    {description}
                                    {itemName && itemId && (
                                        <span className="block mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                            <span className="block text-xs text-slate-500 mb-1">Details</span>
                                            <span className="block text-white font-semibold">{itemName}</span>
                                            <span className="block text-xs text-slate-400 mt-1">ID: {itemId}</span>
                                        </span>
                                    )}
                                    {itemName && !itemId && (
                                        <span className="block mt-2 text-white font-medium">
                                            Item: {itemName}
                                        </span>
                                    )}
                                    {variant === 'delete' && (
                                        <span className="block mt-3 text-xs text-red-400 font-medium">
                                            ⚠️ Warning: This action cannot be undone.
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
                                className={`${buttonColor} text-white border-0`}
                            >
                                {buttonText}
                            </AlertDialogAction>
                            <AlertDialogCancel className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white mt-0">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </>
                )}

                {status === 'loading' && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <AlertDialogTitle className="sr-only">Processing</AlertDialogTitle>
                        <Loader2 className={`h-12 w-12 ${loadingColor} animate-spin mb-4`} />
                        <p className="text-slate-300 text-sm">{loadingMessage || defaultLoadingMessage}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <AlertDialogTitle className="sr-only">Success</AlertDialogTitle>
                        <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Success!</h3>
                        <p className="text-slate-300 text-sm text-center">
                            {successMessage || defaultSuccessMessage}
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <>
                        <div className="p-12 flex flex-col items-center justify-center">
                            <AlertDialogTitle className="sr-only">Error</AlertDialogTitle>
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
