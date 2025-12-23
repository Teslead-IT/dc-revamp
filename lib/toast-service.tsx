"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, X } from "lucide-react"

export const showToast = {
  success: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-green-900">{message}</p>
            {description && <p className="text-sm text-green-700 mt-1">{description}</p>}
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-green-600 hover:text-green-700 hover:bg-green-100 rounded p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    )
  },

  error: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-900">{message}</p>
            {description && <p className="text-sm text-red-700 mt-1">{description}</p>}
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    )
  },

  loading: (message: string) => {
    return toast.custom(
      (t) => (
        <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="h-5 w-5 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin flex-shrink-0 mt-0.5" />
          <p className="font-medium text-blue-900">{message}</p>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded p-1 transition-colors ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-right",
      }
    )
  },
}
