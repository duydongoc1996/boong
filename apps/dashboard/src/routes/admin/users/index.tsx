import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { authClient } from "@/lib/auth-client"
import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/admin/users/")({
    staticData: breadcrumbI18n("users"),
    component: AdminUsersPage,
})

type Row = {
    id: string
    email: string
    name: string
    role?: string | null
}

export function AdminUsersPage() {
    const q = useQuery({
        queryKey: ["admin", "users"],
        queryFn: async () => {
            const res = await authClient.admin.listUsers({
                query: {
                    limit: 100,
                    offset: 0,
                },
            })
            const data = res.data as unknown
            if (data && typeof data === "object" && "users" in data) {
                return (data as { users: Row[] }).users
            }
            if (Array.isArray(data)) {
                return data as Row[]
            }
            return [] as Row[]
        },
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                    Backed by the Better Auth admin plugin (
                    <code className="text-xs">listUsers</code>).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {q.isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center"
                                    >
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : q.data?.length ? (
                                q.data.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-mono text-xs">
                                            {u.email}
                                        </TableCell>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {u.role ?? "user"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center"
                                    >
                                        No users returned.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
