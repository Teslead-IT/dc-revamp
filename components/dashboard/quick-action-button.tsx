import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface QuickActionButtonProps {
  label: string
  href: string
  icon: LucideIcon
  className?: string
}

export function QuickActionButton({ label, href, icon: Icon, className }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}
