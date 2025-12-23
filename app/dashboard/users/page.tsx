import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">User management will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
