
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useSession } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: user, isLoading } = useSession()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Auto-collapse sidebar on tablet and mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-[#0B1120] overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div
        className={cn(
          "flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-[68px]" : "ml-60 lg:ml-64",
        )}
      >
        <Header />
        <main className="flex-1 overflow-hidden p-4 lg:p-6 bg-[#0B1120]">
          {children}
        </main>
      </div>
    </div>
  )
}
