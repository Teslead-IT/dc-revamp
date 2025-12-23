import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PartysPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Partys</h1>
      <Card>
        <CardHeader>
          <CardTitle>Party Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Party/Customer management will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
