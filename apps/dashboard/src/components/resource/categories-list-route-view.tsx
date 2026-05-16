import { useI18nContext } from "@boong/i18n"
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
import { translateError } from "@/lib/i18n-errors"

const orgRouteApi = getRouteApi("/$orgSlug")

const qk = {
    categories: (orgId: string) => ["categories", orgId] as const,
}

export function CategoriesListRouteView() {
    const { LL } = useI18nContext()
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
            toast.success(LL.common.deleted())
            await queryClient.invalidateQueries({
                queryKey: qk.categories(orgId),
            })
        },
        onError: (err) => {
            toast.error(translateError(LL, err))
        },
    })

    const columns: ColumnDef<CategoryRow>[] = [
        { accessorKey: "name", header: LL.categories.list.columnName() },
        {
            accessorKey: "orgId",
            header: LL.categories.list.columnOrg(),
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
                        <DropdownMenuLabel>
                            {LL.common.actions()}
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/$orgSlug/categories/$categoryId"
                                params={{
                                    orgSlug,
                                    categoryId: row.original.id,
                                }}
                            >
                                {LL.common.show()}
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
                                {LL.common.edit()}
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
                            <RefreshCw className="mr-2 size-4" />{" "}
                            {LL.common.refresh()}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                if (
                                    confirm(LL.categories.list.deleteConfirm())
                                ) {
                                    del.mutate(row.original.id)
                                }
                            }}
                        >
                            <Trash2 className="mr-2 size-4" />{" "}
                            {LL.common.delete()}
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
                    <CardTitle>{LL.categories.list.title()}</CardTitle>
                    <CardDescription>
                        {LL.categories.list.description()}
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
                        {LL.common.refresh()}
                    </Button>
                    <Button size="sm" asChild>
                        <Link
                            to="/$orgSlug/categories/new"
                            params={{ orgSlug }}
                        >
                            {LL.categories.list.create()}
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
                                        {LL.common.loading()}
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
                                        {LL.categories.list.empty()}
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
