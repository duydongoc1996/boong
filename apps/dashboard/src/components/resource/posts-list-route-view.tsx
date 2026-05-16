import { useI18nContext } from "@boong/i18n"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getRouteApi,
    Link,
    useNavigate,
    useParams,
} from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"
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
    listEnvelopeSchema,
    type PostRow,
    postRowSchema,
} from "@/lib/api/schemas"
import { translateError } from "@/lib/i18n-errors"
import { extractPlainText } from "@/lib/rich-text/sanitize"

const orgRouteApi = getRouteApi("/$orgSlug")
const postsListRouteApi = getRouteApi("/$orgSlug/posts/")

const qk = {
    posts: (orgId: string) => ["posts", orgId] as const,
}

export function PostsListRouteView() {
    const { LL } = useI18nContext()
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug } = useParams({ strict: false }) as { orgSlug: string }
    const queryClient = useQueryClient()
    const { page, size } = postsListRouteApi.useSearch()
    const navigate = useNavigate({ from: postsListRouteApi.id })

    const query = useQuery({
        queryKey: [...qk.posts(orgId), page, size],
        queryFn: async () => {
            const raw = await apiFetch<unknown>("/posts", { orgId })
            return listEnvelopeSchema(postRowSchema).parse(raw)
        },
    })

    const del = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/posts/${id}`, { method: "DELETE", orgId })
        },
        onSuccess: async () => {
            toast.success(LL.common.deleted())
            await queryClient.invalidateQueries({ queryKey: qk.posts(orgId) })
        },
        onError: (err) => {
            toast.error(translateError(LL, err))
        },
    })

    const columns: ColumnDef<PostRow>[] = [
        { accessorKey: "title", header: LL.posts.list.columnTitle() },
        {
            accessorKey: "content",
            header: LL.posts.list.columnContent(),
            cell: (ctx) => (
                <span className="line-clamp-2 max-w-md text-sm">
                    {extractPlainText(String(ctx.getValue() ?? ""))}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: LL.posts.list.columnCreated(),
            cell: (ctx) => (
                <span className="text-muted-foreground text-xs">
                    {String(ctx.getValue())}
                </span>
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
                                to="/$orgSlug/posts/$postId"
                                params={{
                                    orgSlug,
                                    postId: row.original.id,
                                }}
                            >
                                {LL.common.show()}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/$orgSlug/posts/$postId/edit"
                                params={{
                                    orgSlug,
                                    postId: row.original.id,
                                }}
                            >
                                {LL.common.edit()}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                void queryClient.invalidateQueries({
                                    queryKey: qk.posts(orgId),
                                })
                            }
                        >
                            <RefreshCw className="mr-2 size-4" />{" "}
                            {LL.common.refresh()}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                void navigator.clipboard.writeText(
                                    row.original.id
                                )
                                toast.message(LL.common.copiedToClipboard())
                            }}
                        >
                            {LL.common.copyId()}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                toast.message(LL.common.customAction())
                            }
                        >
                            {LL.common.customAction()}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                if (confirm(LL.posts.list.deleteConfirm())) {
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
        manualPagination: true,
        pageCount: query.data?.total
            ? Math.max(1, Math.ceil(query.data.total / size))
            : 1,
        state: {
            pagination: { pageIndex: page - 1, pageSize: size },
        },
    })

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
                <div>
                    <CardTitle>{LL.posts.list.title()}</CardTitle>
                    <CardDescription>
                        {LL.posts.list.description()}
                    </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            void queryClient.invalidateQueries({
                                queryKey: qk.posts(orgId),
                            })
                        }
                    >
                        <RefreshCw className="mr-1 size-4" />
                        {LL.common.refresh()}
                    </Button>
                    <Button size="sm" asChild>
                        <Link to="/$orgSlug/posts/new" params={{ orgSlug }}>
                            {LL.posts.list.create()}
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            void navigate({
                                search: (prev) => ({
                                    ...prev,
                                    page: Math.max(1, page - 1),
                                }),
                                replace: true,
                            })
                        }
                    >
                        {LL.common.prevPage()}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            void navigate({
                                search: (prev) => ({
                                    ...prev,
                                    page: page + 1,
                                }),
                                replace: true,
                            })
                        }
                    >
                        {LL.common.nextPage()}
                    </Button>
                    <span className="text-muted-foreground self-center text-sm">
                        {LL.common.pageInfo({ page, size })}
                    </span>
                </div>
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
                                        {LL.posts.list.empty()}
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
