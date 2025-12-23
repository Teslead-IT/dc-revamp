"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  FileText,
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Building2,
  BarChart3,
  UsersIcon,
  Package,
  Settings,
  LogOut,
} from "lucide-react"
import { useLogout } from "@/hooks/use-auth"

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: { label: string; href: string; icon: React.ElementType }[]
}

const navItems: NavItem[] = [
  { label: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "STORE",
    icon: Store,
    children: [
      { label: "ALL DC", href: "/dashboard/dc/all", icon: LayoutGrid },
      { label: "DRAFT DC", href: "/dashboard/dc/draft", icon: FileText },
      { label: "OPEN DC", href: "/dashboard/dc/open", icon: FolderOpen },
      { label: "PARTIAL DC", href: "/dashboard/dc/partial", icon: Clock },
      { label: "CLOSED DC", href: "/dashboard/dc/closed", icon: CheckCircle },
      { label: "CANCELLED DC", href: "/dashboard/dc/cancelled", icon: XCircle },
      { label: "DELETED DC", href: "/dashboard/dc/deleted", icon: Trash2 },
      { label: "DEPT OVERALL DC", href: "/dashboard/dc/dept-overall", icon: Building2 },
    ],
  },
  { label: "REPORT", href: "/dashboard/report", icon: BarChart3 },
  { label: "PARTYS", href: "/dashboard/partys", icon: UsersIcon },
  { label: "ITEMS", href: "/dashboard/items", icon: Package },
  { label: "USERS", href: "/dashboard/users", icon: UsersIcon },
  { label: "SETTINGS", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(["STORE"])
  const logoutMutation = useLogout()

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => (prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]))
  }

  const isActive = (href: string) => pathname === href
  const isChildActive = (children?: { href: string }[]) => children?.some((child) => pathname === child.href)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 shadow-xl transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-60 lg:w-64",
      )}
    >
      {/* Logo Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-700/50 transition-all duration-300",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <Image
              src="/teslead-logo-white.png"
              alt="TESLEAD"
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg active:scale-95",
            collapsed && "mx-auto",
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 hide-scrollbar">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => !collapsed && toggleMenu(item.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isChildActive(item.children)
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                          isChildActive(item.children) && "scale-110",
                        )}
                      />
                      <span
                        className={cn(
                          "whitespace-nowrap transition-all duration-300",
                          collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openMenus.includes(item.label) && "rotate-180",
                        )}
                      />
                    )}
                  </button>

                  {/* Submenu with smooth animation */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      !collapsed && openMenus.includes(item.label) ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <ul className="mt-1 space-y-0.5 pl-4 pr-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                              isActive(child.href)
                                ? "bg-indigo-500/20 text-indigo-400 font-medium"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full transition-all duration-200",
                                isActive(child.href) ? "bg-indigo-400 scale-125" : "bg-slate-500",
                              )}
                            />
                            <span className="truncate">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive(item.href!)
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                      isActive(item.href!) && "scale-110",
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with Company Info */}
      <div className={cn("border-t border-slate-700/50 transition-all duration-300", collapsed ? "p-2" : "p-4")}>
        {!collapsed && (
          <div className="mb-4 flex flex-col items-center rounded-lg bg-slate-800/50 p-3">
            <div className="relative h-full w-25 ">
              {/* <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
                <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" fill="rgba(255,255,255,0.2)" />
                <path d="M12 2L22 7L12 12L2 7L12 2Z" fill="rgba(255,255,255,0.4)" />
                <path d="M12 12V22L2 17V7L12 12Z" fill="rgba(255,255,255,0.3)" />
                <path d="M7 9L15 9L12 6L17 10L12 14L15 11L7 11V9Z" fill="white" />
              </svg> */}
                          <p className="mt-1 text-center text-[10px] text-white">Powered By</p>

              <Image src="/teslead-logo-white.png" alt="Company Logo" width={100} height={100} />
            </div>
            {/* <p className="mt-2 text-center text-xs font-semibold text-indigo-400">TESLEAD CONNECT</p> */}
            {/* <p className="text-center text-[10px] text-slate-400">Teslead Equipments Pvt Ltd</p> */}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 cursor-pointer",
            collapsed && "justify-center",
          )}
          title={collapsed ? "LOGOUT" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            LOGOUT
          </span>
        </button>
      </div>
    </aside>
  )
}
