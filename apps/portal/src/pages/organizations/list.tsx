import { useTable } from "@refinedev/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import type { Organization } from "better-auth/client"
import React from "react"
import { DeleteButton } from "@/components/refine-ui/buttons/delete"
import { EditButton } from "@/components/refine-ui/buttons/edit"
import { ShowButton } from "@/components/refine-ui/buttons/show"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import {
    ListView,
    ListViewHeader,
} from "@/components/refine-ui/views/list-view"

export const OrganizationList = () => {
    const columns = React.useMemo(() => {
        const columnHelper = createColumnHelper<Organization>()

        return [
            columnHelper.accessor("id", {
                id: "id",
                enableSorting: true,
                header: "ID",
            }),
            columnHelper.accessor("name", {
                id: "name",
                header: "Name",
                enableSorting: true,
            }),
            columnHelper.accessor("slug", {
                id: "slug",
                header: "Slug",
                enableSorting: true,
            }),
            columnHelper.accessor("createdAt", {
                id: "createdAt",
                header: "Created At",
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
                            resource="organizations"
                            dataProviderName="org"
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
            resource: "organizations",
            syncWithLocation: true,
            dataProviderName: "org",
            pagination: {
                mode: "client",
            },
        },
    })

    return (
        <ListView>
            <ListViewHeader canCreate={true} />
            <DataTable table={table} />
        </ListView>
    )
}
