"use client"

import React from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

export interface CustomToastProps {
  type: "success" | "error" | "info"
  title: string
  description?: string
  onDismiss?: () => void
}

export function CustomToast({ type, title, description, onDismiss }: CustomToastProps) {
  const config = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      title: "text-green-900",
      description: "text-green-700",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-900",
      description: "text-red-700",
      icon: XCircle,
      iconColor: "text-red-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-900",
      description: "text-blue-700",
      icon: CheckCircle,
      iconColor: "text-blue-600",
    },
  }

  const currentConfig = config[type]
  const Icon = currentConfig.icon

  return (
    <div
      className={`flex items-start gap-3 rounded-lg ${currentConfig.bg} border ${currentConfig.border} p-4 shadow-lg animate-in fade-in slide-in-from-top-2`}
    >
      <Icon className={`h-5 w-5 ${currentConfig.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`font-medium ${currentConfig.title}`}>{title}</p>
        {description && <p className={`text-sm ${currentConfig.description} mt-1`}>{description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className={`${currentConfig.iconColor} hover:bg-opacity-10 hover:bg-current rounded p-1 transition-colors`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
