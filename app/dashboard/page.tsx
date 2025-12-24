"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-auth"
import { useHeaderStore } from "@/hooks/use-header-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Package, CheckCircle, Clock, Users, FolderKanban, GripVertical, MoreVertical, Settings2, FileDown, X } from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import GridLayout from "react-grid-layout"
import "react-grid-layout/css/styles.css"

// Widget configuration types
type WidgetId =
  | 'active-dcs'
  | 'closed-dcs'
  | 'open-dcs'
  | 'partial-dcs'
  | 'customers'
  | 'dc-groups'
  | 'dc-status-report'
  | 'monthly-dc-summary'
  | 'top-customers-report'
  | 'dc-timeline-summary'

interface WidgetConfig {
  id: WidgetId
  label: string
  category: 'Stats' | 'Charts'
  enabled: boolean
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'active-dcs', label: 'Active DCs', category: 'Stats', enabled: true },
  { id: 'closed-dcs', label: 'Closed DCs', category: 'Stats', enabled: true },
  { id: 'open-dcs', label: 'Open DCs', category: 'Stats', enabled: true },
  { id: 'partial-dcs', label: 'Partial DCs', category: 'Stats', enabled: true },
  { id: 'customers', label: 'Customers', category: 'Stats', enabled: true },
  { id: 'dc-groups', label: 'DC Groups', category: 'Stats', enabled: true },
  { id: 'dc-status-report', label: 'DC Status Report', category: 'Charts', enabled: true },
  { id: 'monthly-dc-summary', label: 'Monthly DC Summary', category: 'Charts', enabled: true },
  { id: 'top-customers-report', label: 'Top Customers Report', category: 'Charts', enabled: true },
  { id: 'dc-timeline-summary', label: 'DC Timeline Summary', category: 'Charts', enabled: true },
]

// Stat Counter Component with clickable navigation
function StatCounter({
  id,
  icon: Icon,
  label,
  value,
  color,
  href,
  onHide
}: {
  id: WidgetId
  icon: any
  label: string
  value: number | string
  color: string
  href: string
  onHide: (id: WidgetId) => void
}) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(href)}
      className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-all cursor-pointer group shadow-sm overflow-hidden h-[90px]`}
    >
      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-slate-500 fill-current">
          <path d="M0 20 L0 10 Q 50 25 100 10 L100 20 Z" />
        </svg>
      </div>

      {/* Icon in bottom-right */}
      <div className="absolute bottom-2 right-3 opacity-20 group-hover:opacity-40 transition-opacity z-10">
        <Icon className="h-6 w-6 text-slate-300" />
      </div>

      <div className="flex flex-col items-start w-full relative z-10 pl-1">
        {/* Value */}
        <div className="text-2xl font-bold text-slate-100 leading-none mb-1">{value}</div>

        {/* Label */}
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</div>
      </div>

      {/* Three-dot menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-slate-700/50 rounded-full"
          >
            <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1e293b] border-slate-700" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onHide(id)
            }}
            className="text-slate-300 hover:text-slate-100 hover:bg-slate-800 cursor-pointer text-xs"
          >
            Hide Widget
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Decorative corner element for cards
function CardDecoration() {
  return (
    <>
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor" className="text-slate-100">
          <path d="M0 0 L100 0 L100 100 Z" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-800/20 to-transparent rounded-tr-full pointer-events-none" />
    </>
  )
}

// Chart dummy data
const statusData = [
  { name: 'Draft', value: 5, color: '#6366f1' },
  { name: 'Open', value: 12, color: '#f59e0b' },
  { name: 'Partial', value: 8, color: '#f97316' },
  { name: 'Closed', value: 25, color: '#10b981' },
  { name: 'Cancelled', value: 3, color: '#ef4444' },
]

const monthlyData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 22 },
  { month: 'Jun', count: 30 },
]

const customerData = [
  { name: 'Dharani Akka', count: 15 },
  { name: 'Vicky', count: 12 },
  { name: 'Kumar', count: 10 },
  { name: 'Arun', count: 8 },
  { name: 'Gopi', count: 6 },
]

// Fixed 2x2 grid layout
const defaultLayout = [
  { i: 'dc-status-report', x: 0, y: 0, w: 6, h: 2 },
  { i: 'monthly-dc-summary', x: 6, y: 0, w: 6, h: 2 },
  { i: 'top-customers-report', x: 0, y: 2, w: 6, h: 2 },
  { i: 'dc-timeline-summary', x: 6, y: 2, w: 6, h: 2 },
]

export default function DashboardPage() {
  const { data: user } = useSession()
  const { setTitle } = useHeaderStore()
  const [layout, setLayout] = useState(defaultLayout)
  const [containerWidth, setContainerWidth] = useState(1200)
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS)
  const [tempWidgets, setTempWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)

  useEffect(() => {
    setTitle("Home")
  }, [setTitle])

  // Load widget configuration from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout')
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLayout(parsed)
        }
      } catch (e) {
        console.error("Failed to parse saved layout", e)
      }
    }

    const savedWidgets = localStorage.getItem('dashboardWidgets')
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets)
        if (Array.isArray(parsed)) {
          setWidgets(parsed)
          setTempWidgets(parsed)
        }
      } catch (e) {
        console.error("Failed to parse saved widgets", e)
      }
    }
  }, [])

  // Responsive width tracking
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Subtract padding (px-4 = 32px) + buffer to strictly prevent horizontal scrolling
        setContainerWidth(containerRef.current.offsetWidth - 40)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    const observer = new ResizeObserver(updateWidth)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', updateWidth)
      observer.disconnect()
    }
  }, [])

  // Save layout to localStorage
  const onLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout)
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout))
  }

  // Toggle widget enabled state
  const toggleWidget = (id: WidgetId) => {
    const updatedWidgets = widgets.map(w =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    )
    setWidgets(updatedWidgets)
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets))
  }

  // Hide widget (from three-dot menu)
  const hideWidget = (id: WidgetId) => {
    toggleWidget(id)
  }

  // Get enabled widgets
  const enabledStatWidgets = widgets.filter(w => w.category === 'Stats' && w.enabled)
  const enabledChartWidgets = widgets.filter(w => w.category === 'Charts' && w.enabled)
  const isWidgetEnabled = (id: WidgetId) => widgets.find(w => w.id === id)?.enabled ?? false

  return (
    <div
      className="h-full overflow-auto bg-[#0B1120]"
      style={{
        backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      {/* FIXED HEADER SECTION */}
      <div className="sticky top-0 z-10 bg-[#0B1120]/95 backdrop-blur-sm border-b border-slate-900 pb-3">
        {/* Welcome Section with Three-Dot Menu */}
        <div className="px-4 pt-3 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Welcome {user?.name || "User"}</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Company: <span className="text-slate-300">{user?.email || "teslead@example.com"}</span>
            </p>
          </div>

          {/* Widget Customization Popover */}
          <Popover open={isCustomizeOpen} onOpenChange={(open) => {
            if (open) {
              setTempWidgets(widgets) // Reset temp state on open
            }
            setIsCustomizeOpen(open)
          }}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-800">
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] bg-[#1e293b] border-slate-700 p-0 shadow-xl mr-2">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-700/50 p-3">
                <h3 className="text-sm font-medium text-slate-100">Widgets</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-slate-700 rounded-full"
                  onClick={() => setIsCustomizeOpen(false)}
                >
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </Button>
              </div>

              {/* Scrollable List */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                <div className="space-y-1">
                  {tempWidgets.map(widget => (
                    <div key={widget.id} className="flex items-center justify-between px-2 py-2 rounded hover:bg-slate-800/50 transition-colors">
                      <span className="text-xs text-slate-300">{widget.label}</span>
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={() => {
                          setTempWidgets(prev => prev.map(w =>
                            w.id === widget.id ? { ...w, enabled: !w.enabled } : w
                          ))
                        }}
                        className="scale-75 data-[state=checked]:bg-brand"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-700/50 p-3 bg-[#1e293b]">
                <Button
                  onClick={() => setIsCustomizeOpen(false)}
                  variant="ghost"
                  className="h-7 px-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Restore layout for enabled widgets if missing
                    const enabledChartIds = tempWidgets.filter(w => w.enabled && w.category === 'Charts').map(w => w.id)
                    setLayout(prev => {
                      const newLayout = [...prev]
                      enabledChartIds.forEach(id => {
                        // If widget is enabled but not in current layout, restore it from default
                        if (!newLayout.find(l => l.i === id)) {
                          const defaultItem = defaultLayout.find(d => d.i === id)
                          if (defaultItem) {
                            newLayout.push(defaultItem)
                          }
                        }
                      })
                      // Save updated layout
                      localStorage.setItem('dashboardLayout', JSON.stringify(newLayout))
                      return newLayout
                    })

                    setWidgets(tempWidgets)
                    localStorage.setItem('dashboardWidgets', JSON.stringify(tempWidgets))
                    setIsCustomizeOpen(false)
                  }}
                  className="h-7 px-3 text-xs bg-brand hover:bg-brand/90 text-white"
                >
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Counter Stats */}
        {enabledStatWidgets.length > 0 && (
          <div className="px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {isWidgetEnabled('active-dcs') && (
              <StatCounter id="active-dcs" icon={FileText} label="Active DCs" value={12} color="bg-brand" href="/dashboard/dc/all" onHide={hideWidget} />
            )}
            {isWidgetEnabled('closed-dcs') && (
              <StatCounter id="closed-dcs" icon={CheckCircle} label="Closed DCs" value={25} color="bg-emerald-600" href="/dashboard/dc/all" onHide={hideWidget} />
            )}
            {isWidgetEnabled('open-dcs') && (
              <StatCounter id="open-dcs" icon={Clock} label="Open DCs" value={8} color="bg-amber-600" href="/dashboard/dc/all" onHide={hideWidget} />
            )}
            {isWidgetEnabled('partial-dcs') && (
              <StatCounter id="partial-dcs" icon={Package} label="Partial DCs" value={5} color="bg-orange-600" href="/dashboard/dc/all" onHide={hideWidget} />
            )}
            {isWidgetEnabled('customers') && (
              <StatCounter id="customers" icon={Users} label="Customers" value={42} color="bg-indigo-600" href="/dashboard/dc/all" onHide={hideWidget} />
            )}
            {isWidgetEnabled('dc-groups') && (
              <StatCounter id="dc-groups" icon={FolderKanban} label="DC Groups" value={6} color="bg-purple-600" href="/dashboard/dc/all" onHide={hideWidget} />
            )}
          </div>
        )}
      </div>

      {/* SCROLLABLE DRAGGABLE CARDS SECTION */}
      {enabledChartWidgets.length > 0 ? (
        <div className="px-4 py-4" ref={containerRef}>
          <GridLayout
            className="layout"
            layout={layout.filter(l => isWidgetEnabled(l.i as WidgetId))}
            cols={12}
            rowHeight={60}
            width={containerWidth}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
            isDraggable={true}
            isResizable={false}
            compactType="vertical"
            margin={[16, 16]}
            containerPadding={[0, 0]}
          >
            {/* DC Status Report Card */}
            {isWidgetEnabled('dc-status-report') && (
              <div key="dc-status-report">
                <Card className="h-full bg-[#1e293b] border-slate-700 relative overflow-hidden shadow-sm group">
                  <CardDecoration />
                  <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2 border-b border-slate-700/50 px-4 py-3">
                    <CardTitle className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                      <GripVertical className="h-3.5 w-3.5 text-slate-500 drag-handle cursor-move" />
                      DC Status Report
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1e293b] border-slate-700">
                        <DropdownMenuItem
                          onClick={() => hideWidget('dc-status-report')}
                          className="text-slate-300 hover:text-slate-100 hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          Hide Widget
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="relative z-10  px-10 pb-4 h-[190px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            color: '#f1f5f9',
                            fontSize: '11px'
                          }}
                          itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{ fontSize: '10px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Monthly DC Summary */}
            {isWidgetEnabled('monthly-dc-summary') && (
              <div key="monthly-dc-summary">
                <Card className="h-full bg-[#1e293b] border-slate-700 relative overflow-hidden shadow-sm group">
                  <CardDecoration />
                  <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2 border-b border-slate-700/50 px-4 py-3">
                    <CardTitle className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                      <GripVertical className="h-3.5 w-3.5 text-slate-500 drag-handle cursor-move" />
                      Monthly DC Summary
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1e293b] border-slate-700">
                        <DropdownMenuItem
                          onClick={() => hideWidget('monthly-dc-summary')}
                          className="text-slate-300 hover:text-slate-100 hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          Hide Widget
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-2 px-4 pb-4 h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                        <Tooltip
                          cursor={{ fill: '#334155', opacity: 0.4 }}
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            color: '#f1f5f9',
                            fontSize: '11px'
                          }}
                          itemStyle={{ color: '#f1f5f9' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Top Customers Report */}
            {isWidgetEnabled('top-customers-report') && (
              <div key="top-customers-report">
                <Card className="h-full bg-[#1e293b] border-slate-700 relative overflow-hidden shadow-sm group">
                  <CardDecoration />
                  <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2 border-b border-slate-700/50 px-4 py-3">
                    <CardTitle className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                      <GripVertical className="h-3.5 w-3.5 text-slate-500 drag-handle cursor-move" />
                      Top Customers Report
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1e293b] border-slate-700">
                        <DropdownMenuItem
                          onClick={() => hideWidget('top-customers-report')}
                          className="text-slate-300 hover:text-slate-100 hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          Hide Widget
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-2 px-4 pb-4 h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" width={80} />
                        <Tooltip
                          cursor={{ fill: '#334155', opacity: 0.4 }}
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            color: '#f1f5f9',
                            fontSize: '11px'
                          }}
                          itemStyle={{ color: '#f1f5f9' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* DC Timeline Summary */}
            {isWidgetEnabled('dc-timeline-summary') && (
              <div key="dc-timeline-summary">
                <Card className="h-full bg-[#1e293b] border-slate-700 relative overflow-hidden shadow-sm group">
                  <CardDecoration />
                  <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2 border-b border-slate-700/50 px-4 py-3">
                    <CardTitle className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                      <GripVertical className="h-3.5 w-3.5 text-slate-500 drag-handle cursor-move" />
                      DC Timeline Summary
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1e293b] border-slate-700">
                        <DropdownMenuItem
                          onClick={() => hideWidget('dc-timeline-summary')}
                          className="text-slate-300 hover:text-slate-100 hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          Hide Widget
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-2 px-4 pb-4 h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                        <Tooltip
                          cursor={{ stroke: '#334155', strokeWidth: 2 }}
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            color: '#f1f5f9',
                            fontSize: '11px'
                          }}
                          itemStyle={{ color: '#f1f5f9' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ fill: '#f59e0b', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </GridLayout>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          {/* Empty State SVG Illustration */}
          <div className="mb-8 opacity-40">
            <svg width="400" height="280" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Widget Grid Illustration */}
              {/* Row 1 */}
              <rect x="20" y="20" width="170" height="120" rx="8" fill="#334155" opacity="0.6" />
              <rect x="210" y="20" width="170" height="120" rx="8" fill="#334155" opacity="0.5" />

              {/* Row 2 */}
              <rect x="20" y="160" width="170" height="100" rx="8" fill="#334155" opacity="0.4" />
              <rect x="210" y="160" width="170" height="100" rx="8" fill="#334155" opacity="0.3" />

              {/* Decorative elements inside cards */}
              <circle cx="105" cy="70" r="25" fill="#10b981" opacity="0.3" />
              <rect x="230" y="45" width="130" height="8" rx="4" fill="#6366f1" opacity="0.3" />
              <rect x="230" y="65" width="100" height="8" rx="4" fill="#6366f1" opacity="0.3" />
              <rect x="230" y="85" width="115" height="8" rx="4" fill="#6366f1" opacity="0.3" />
            </svg>
          </div>

          <p className="text-slate-400 text-sm mb-1">Widgets display a summary of your Delivery Challans.</p>
          <p className="text-slate-400 text-sm mb-6">Enable widgets and view data in this section.</p>
          <Button onClick={() => setIsCustomizeOpen(true)} className="bg-brand hover:bg-brand/90">
            Enable Widgets
          </Button>
        </div>
      )}

      {/* No extra dialogs needed as Popover handles it in place */}
    </div>
  )
}
