import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getRouteApi, Link, useParams } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api/http"
import {
    type CategoryRow,
    categoryRowSchema,
    listEnvelopeSchema,
} from "@/lib/api/schemas"

const orgRouteApi = getRouteApi("/$orgSlug")

const qk = {
    categories: (orgId: string) => ["categories", orgId] as const,
}

export function CategoriesListRouteView() {
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug } = useParams({ strict: false }) as { orgSlug: string }
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: qk.categories(orgId),
        queryFn: async () => {
            const raw = await apiFetch<unknown>("/categories")
            const parsed = listEnvelopeSchema(categoryRowSchema).parse(raw)
            return {
                ...parsed,
                data: parsed.data.filter((row) => row.orgId === orgId),
            }
        },
    })

    const del = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/categories/${id}`, { method: "DELETE" })
        },
        onSuccess: async () => {
            toast.success("Deleted")
            await queryClient.invalidateQueries({
                queryKey: qk.categories(orgId),
            })
        },
    })

    const columns: ColumnDef<CategoryRow>[] = [
        { accessorKey: "name", header: "Name" },
        {
            accessorKey: "orgId",
            header: "Org",
            cell: (ctx) => (
                <Badge variant="outline" className="font-mono text-xs">
                    {String(ctx.getValue())}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/$orgSlug/categories/$categoryId"
                                params={{
                                    orgSlug,
                                    categoryId: row.original.id,
                                }}
                            >
                                Show
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/$orgSlug/categories/$categoryId/edit"
                                params={{
                                    orgSlug,
                                    categoryId: row.original.id,
                                }}
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                void queryClient.invalidateQueries({
                                    queryKey: qk.categories(orgId),
                                })
                            }
                        >
                            <RefreshCw className="mr-2 size-4" /> Refresh
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                if (confirm("Delete this category?")) {
                                    del.mutate(row.original.id)
                                }
                            }}
                        >
                            <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    const table = useReactTable({
        data: query.data?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
                <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                        Uses <code className="text-xs">/api/categories</code>.
                        The list endpoint is not org-scoped yet; rows are
                        filtered in the UI to the active organization.
                    </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            void queryClient.invalidateQueries({
                                queryKey: qk.categories(orgId),
                            })
                        }
                    >
                        <RefreshCw className="mr-1 size-4" />
                        Refresh
                    </Button>
                    <Button size="sm" asChild>
                        <Link
                            to="/$orgSlug/categories/new"
                            params={{ orgSlug }}
                        >
                            Create
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <TableHead key={h.id}>
                                            {h.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      h.column.columnDef.header,
                                                      h.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {query.isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No categories for this org.
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
