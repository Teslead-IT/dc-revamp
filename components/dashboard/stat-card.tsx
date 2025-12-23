import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  trend?: string
  trendUp?: boolean
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function StatCard({ title, value, subtitle, trend, trendUp, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trendUp ? "text-green-600" : "text-red-600")}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </div>
  )
}
