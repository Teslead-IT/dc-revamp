
"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { motion, AnimatePresence } from "framer-motion"
import { useThemeStore } from "@/hooks/use-theme-store"

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: { label: string; href: string; icon: React.ElementType }[]
}

const navItems: NavItem[] = [
  { label: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
  { label: "DELIVERY CHALLANS", href: "/dashboard/dc/all", icon: LayoutGrid },
  { label: "REPORT", href: "/dashboard/report", icon: BarChart3 },
  { label: "PARTYS", href: "/dashboard/partys", icon: UsersIcon },
  { label: "ITEMS", href: "/dashboard/items", icon: Package },
  { label: "USERS", href: "/dashboard/users", icon: UsersIcon },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { currentLineArt } = useThemeStore()
  // Open STORE menu by default or if a child is active
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const logoutMutation = useLogout()

  // Initialize open menu based on active route
  useEffect(() => {
    const activeItem = navItems.find(item =>
      item.children?.some(child => pathname === child.href)
    );
    if (activeItem && !openMenus.includes(activeItem.label)) {
      setOpenMenus(prev => [...prev, activeItem.label]);
    }
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => (prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]))
  }

  const isActive = (href: string) => pathname === href
  const isChildActive = (children?: { href: string }[]) => children?.some((child) => pathname === child.href)

  const sidebarVariants = {
    expanded: { width: "16rem" }, // w-64
    collapsed: { width: "4.5rem" } // w-[72px] ~ 4.5rem
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#0F172A] border-r border-slate-800 shadow-2xl transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn("relative flex h-16 items-center border-b border-slate-800/60 transition-all duration-300", collapsed ? "justify-center" : "justify-between px-6")}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <Image
                src="/Teslead-Logo-White.png" // Ensure this uses a white logo for dark theme
                alt="TESLEAD"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="single-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Image
                src="/single-logo.png"
                alt="TESLEAD"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-lg ring-4 ring-[#0F172A] hover:bg-brand/90 transition-colors z-50 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        <ul className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const isMainActive = isActive(item.href || "") || isChildActive(item.children); // Check if parent or any child is active
            const isOpen = openMenus.includes(item.label);

            return (
              <li key={item.label}>
                {item.children ? (
                  // Parent Item with Children
                  <>
                    <button
                      onClick={() => !collapsed && toggleMenu(item.label)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand",
                        isChildActive(item.children)
                          ? "bg-slate-800 text-slate-100"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn("flex items-center justify-center transition-colors", isMainActive ? "text-brand-highlight" : "text-slate-400 group-hover:text-slate-300")}>
                          <item.icon className="h-4 w-4" strokeWidth={isMainActive ? 2.5 : 2} />
                        </div>
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      {!collapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-slate-500 transition-transform duration-300",
                            isOpen && "rotate-180 text-brand-highlight"
                          )}
                        />
                      )}
                    </button>

                    {/* Dropdown Menu Animation */}
                    <AnimatePresence>
                      {!collapsed && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-1 space-y-1 pl-10 pr-2 pb-2 border-l border-slate-800 ml-5">
                            {item.children.map((child) => {
                              const isChildActiveItem = isActive(child.href);
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors duration-200",
                                      isChildActiveItem
                                        ? "text-brand-highlight bg-brand/10"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                                    )}
                                  >
                                    <span className={cn("h-1.5 w-1.5 rounded-full", isChildActiveItem ? "bg-brand" : "bg-slate-600")} />
                                    <span>{child.label}</span>
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  // Single Item
                  <Link
                    href={item.href!}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand",
                      isActive(item.href!)
                        ? "bg-slate-800 text-slate-100 relative overflow-hidden"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active Indicator Line */}
                    {isActive(item.href!) && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-r-md"
                      />
                    )}

                    <div className={cn("flex items-center justify-center z-10", isActive(item.href!) ? "text-brand-highlight" : "text-slate-400 group-hover:text-slate-300")}>
                      <item.icon className="h-4 w-4" strokeWidth={isActive(item.href!) ? 2.5 : 2} />
                    </div>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap z-10"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Line Art Background (Bottom) */}
      {!collapsed && currentLineArt && (
        <div className="absolute bottom-8 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0 opacity-80 user-select-none flex items-end justify-center">
          <img
            src={currentLineArt}
            alt=""
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-slate-800 bg-transparent p-4 relative z-10">
        {/* <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 flex flex-col items-center gap-2 rounded-xl bg-slate-900/50 p-4 border border-slate-800/50"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Powered By</span>
              <Image src="/Teslead-Logo-White.png" alt="Company Logo" width={80} height={20} className="opacity-80" />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-4 flex justify-center"
            >
              <Image src="/single-logo.png" alt="Icon" width={24} height={24} className="opacity-80 object-contain" />
            </motion.div>
          )}
        </AnimatePresence> */}

        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className={cn(
            "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400",
            collapsed && "justify-center"
          )}
          title="Logout"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  )
}
