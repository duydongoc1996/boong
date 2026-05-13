import { useTable } from "@refinedev/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import React from "react"
import { DeleteButton } from "@/components/refine-ui/buttons/delete"
import { EditButton } from "@/components/refine-ui/buttons/edit"
import { ShowButton } from "@/components/refine-ui/buttons/show"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import {
    DataTableFilterDropdownDateRangePicker,
    DataTableFilterDropdownText,
} from "@/components/refine-ui/data-table/data-table-filter"
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter"
import {
    ListView,
    ListViewHeader,
} from "@/components/refine-ui/views/list-view"
import { useOrg } from "@/hooks/use-org"
import type { Post } from "./types"

export const PostList = () => {
    const { metaHeaders } = useOrg()
    const columns = React.useMemo(() => {
        const columnHelper = createColumnHelper<Post>()

        return [
            columnHelper.accessor("id", {
                id: "id",
                enableSorting: true,
                header: ({ column }) => (
                    <div className="flex items-center gap-1">
                        <span>ID</span>
                        <DataTableSorter column={column} />
                    </div>
                ),
            }),
            columnHelper.accessor("title", {
                id: "title",
                header: ({ column, table }) => (
                    <div className="flex items-center gap-1">
                        <span>Title</span>
                        <div>
                            <DataTableFilterDropdownText
                                defaultOperator="contains"
                                column={column}
                                table={table}
                                placeholder="Filter by title"
                            />
                        </div>
                    </div>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor("content", {
                id: "content",
                header: "Content",
                enableSorting: false,
                cell: ({ getValue }) => {
                    const content = getValue()
                    if (!content) return "-"
                    return (
                        <div className="max-w-xs truncate">
                            {content.slice(0, 80)}...
                        </div>
                    )
                },
            }),
            columnHelper.accessor("createdAt", {
                id: "createdAt",
                header: ({ column }) => (
                    <div className="flex items-center gap-1">
                        <span>Created At</span>
                        <DataTableSorter column={column} />
                        <DataTableFilterDropdownDateRangePicker
                            column={column}
                            formatDateRange={(dateRange) => {
                                if (!dateRange?.from || !dateRange?.to)
                                    return undefined
                                return [
                                    dateRange.from.toISOString(),
                                    dateRange.to.toISOString(),
                                ]
                            }}
                        />
                    </div>
                ),
                cell: ({ getValue }) => {
                    const date = getValue()
                    return date ? new Date(date).toLocaleDateString() : "-"
                },
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <EditButton recordItemId={row.original.id} size="sm" />
                        <ShowButton recordItemId={row.original.id} size="sm" />
                        <DeleteButton
                            recordItemId={row.original.id}
                            size="sm"
                        />
                    </div>
                ),
                enableSorting: false,
                size: 290,
            }),
        ]
    }, [])

    const table = useTable({
        columns,
        refineCoreProps: {
            syncWithLocation: true,
            meta: metaHeaders ? { headers: metaHeaders } : undefined,
        },
    })

    return (
        <ListView>
            <ListViewHeader canCreate={true} />
            <DataTable table={table} />
        </ListView>
    )
}
