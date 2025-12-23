"use client"

import { useSession } from "@/hooks/use-auth"
import { Bell, Search, Settings } from "lucide-react"

export function Header() {
  const { data: user } = useSession()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-4">{/* Breadcrumb or page title can go here */}</div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <Search className="h-[18px] w-[18px]" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Settings */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <Settings className="h-[18px] w-[18px]" />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
