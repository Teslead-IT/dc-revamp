
"use client"

import Link from "next/link"
import { useSession } from "@/hooks/use-auth"
import { Bell, Search, Settings } from "lucide-react"
import { useHeaderStore } from "@/hooks/use-header-store"
import { cn } from "@/lib/utils"

export function Header() {
  const { data: user } = useSession()
  const { title, tabs, activeTab, setActiveTab } = useHeaderStore()

  return (
    <header className="sticky top-0 z-30 flex h-10 items-center justify-between border-b border-slate-800 bg-[#202124] px-3 md:p-8 md:px-10 lg:px-10">
      {/* LEFT: Dynamic Title & Tabs */}
      <div className="flex items-center gap-4 h-full">
        {title && <h1 className="text-lg font-semibold text-slate-100 hidden md:block">{title}</h1>}

        {tabs.length > 0 && (
          <div className="flex h-full items-center gap-4 text-xs font-medium text-slate-400 justify-center align-center">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  tab.onClick?.();
                }}
                className={cn(
                  "pb-2.5 px-1 transition-colors relative",
                  activeTab === tab.value ? "text-brand-highlight" : "hover:text-slate-200"
                )}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-highlight rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Static Global Controls */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
          <Search className="h-[16px] w-[16px]" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
          <Bell className="h-[16px] w-[16px]" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-[#202124]" />
        </button>

        {/* Settings */}
        <Link href="/dashboard/settings">
          <button className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
            <Settings className="h-[16px] w-[16px]" />
          </button>
        </Link>

        {/* Divider */}
        <div className="mx-1.5 h-5 w-px bg-slate-800" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white shadow-sm border border-slate-700">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-slate-200">{user?.name || "User"}</p>
            <p className="text-[10px] text-slate-500">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
