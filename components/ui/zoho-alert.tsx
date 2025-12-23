"use client"
import { cn } from "@/lib/utils"

interface ZohoAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: "danger" | "warning" | "info"
}

export function ZohoAlert({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: ZohoAlertProps) {
  if (!open) return null

  const variantStyles = {
    danger: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  }

  const buttonStyles = {
    danger: "bg-indigo-600 hover:bg-red-600",
    warning: "bg-amber-500 hover:bg-amber-600",
    info: "bg-blue-500 hover:bg-blue-600",
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={handleCancel} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Title badge extending above card */}
        <div className="flex justify-left ml-9.5">
          <div className="badge-wrapper">
            <div
            className={cn(
              // "relative z-10 -mb-3 rounded-md px-5 py-2 text-sm font-semibold text-white shadow-lg",
              "badge-pop",
              variantStyles[variant],
            )}
          >
            {title}
          </div>
          </div>
          
        </div>

        {/* Card body */}
        <div className="rounded-xl bg-white px-6 pb-6 pt-8 shadow-2xl">
          <p className="text-center text-sm leading-relaxed text-slate-600">{description}</p>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleConfirm}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium text-white transition-colors cursor-pointer",
                buttonStyles[variant],
              )}
            >
              {confirmLabel}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
