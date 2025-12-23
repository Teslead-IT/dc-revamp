import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Report Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Report generation and analytics will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
