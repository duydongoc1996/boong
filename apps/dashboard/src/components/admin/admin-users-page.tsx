import { useI18nContext } from "@boong/i18n"
import { useQuery } from "@tanstack/react-query"
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

type Row = {
    id: string
    email: string
    name: string
    role?: string | null
}

export function AdminUsersPage() {
    const { LL } = useI18nContext()
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
                <CardTitle>{LL.admin.users.title()}</CardTitle>
                <CardDescription>
                    {LL.admin.users.description()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {LL.admin.users.columnEmail()}
                                </TableHead>
                                <TableHead>
                                    {LL.admin.users.columnName()}
                                </TableHead>
                                <TableHead>
                                    {LL.admin.users.columnRole()}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {q.isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center"
                                    >
                                        {LL.common.loading()}
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
                                                {u.role ??
                                                    LL.admin.users.defaultRole()}
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
                                        {LL.admin.users.empty()}
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
