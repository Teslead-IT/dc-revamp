"use client"

import { useSession } from "@/hooks/use-auth"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionButton } from "@/components/dashboard/quick-action-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, CheckCircle, Clock, Plus, Lock, Eye, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Demo data for charts
const weeklyData = [
  { date: "2025-11-30", count: 0 },
  { date: "2025-12-01", count: 0 },
  { date: "2025-12-02", count: 0 },
  { date: "2025-12-03", count: 0 },
  { date: "2025-12-04", count: 0 },
  { date: "2025-12-05", count: 0 },
  { date: "2025-12-06", count: 0 },
]

const monthlyData = [
  { date: "2025-11-07", revenue: 0 },
  { date: "2025-11-09", revenue: 0 },
  { date: "2025-11-11", revenue: 0 },
  { date: "2025-11-13", revenue: 0 },
  { date: "2025-11-15", revenue: 0 },
  { date: "2025-11-17", revenue: 0 },
  { date: "2025-11-19", revenue: 0 },
  { date: "2025-11-21", revenue: 0 },
  { date: "2025-11-23", revenue: 0 },
  { date: "2025-11-25", revenue: 0 },
  { date: "2025-11-27", revenue: 0 },
  { date: "2025-11-29", revenue: 0 },
  { date: "2025-12-01", revenue: 0 },
  { date: "2025-12-03", revenue: 0 },
  { date: "2025-12-05", revenue: 0 },
]

export default function DashboardPage() {
  const { data: user } = useSession()

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <h2 className="text-xl font-semibold text-slate-100 lg:text-2xl">Welcome back, {user?.name || "admin"}</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="DRAFT DC"
          value={0}
          subtitle="Draft DC"
          trend="+6% from last week"
          trendUp
          icon={FileText}
          iconBg="bg-indigo-500/10"
          iconColor="text-indigo-400"
        />
        <StatCard
          title="OPEN DC"
          value={0}
          subtitle="Delivery Challans Pending"
          trend="No pending DCs"
          trendUp
          icon={FolderOpen}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-400"
        />
        <StatCard
          title="CLOSED DC"
          value={0}
          subtitle="Completed This Month"
          trend="0 completed"
          trendUp
          icon={CheckCircle}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-400"
        />
        <StatCard
          title="PARTIAL DC"
          value={0}
          subtitle="Partially Delivered"
          trend="0 in progress"
          trendUp
          icon={Clock}
          iconBg="bg-orange-500/10"
          iconColor="text-orange-400"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-slate-100">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionButton label="Create New DC" href="/dashboard/dc/new" icon={Plus} className="bg-indigo-600 hover:bg-indigo-700" />
          <QuickActionButton label="Closed Dc" href="/dashboard/dc/closed" icon={Lock} className="bg-amber-600 hover:bg-amber-700" />
          <QuickActionButton label="Check Pending DCs" href="/dashboard/dc/open" icon={Eye} className="bg-red-600 hover:bg-red-700" />
          <QuickActionButton
            label="View Reports"
            href="/dashboard/report"
            icon={BarChart3}
            className="bg-emerald-600 hover:bg-emerald-700"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-[#111827] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
            <CardTitle className="text-base font-semibold text-slate-100">Weekly Report</CardTitle>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">Last 7 Days</span>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#334155" axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#334155" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="DC Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
            <CardTitle className="text-base font-semibold text-slate-100">Monthly Report</CardTitle>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">Last 30 Days</span>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    stroke="#334155"
                    axisLine={false}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    dy={10}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#334155" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-[#111827] border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
          <CardTitle className="text-base font-semibold text-slate-100">Recent Activities</CardTitle>
          <button className="rounded-md bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            View All
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-slate-500" />
            </div>
            <p className="text-sm text-slate-400">No recent activities found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
