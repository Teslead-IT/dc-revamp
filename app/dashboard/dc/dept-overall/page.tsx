"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeptOverallDCPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Department Overall DC</h1>

      <Card>
        <CardHeader>
          <CardTitle>Department Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Department overall DC view will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
