import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ItemsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Items</h1>
      <Card>
        <CardHeader>
          <CardTitle>Item Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Item/Product management will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
