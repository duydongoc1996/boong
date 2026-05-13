import { useTable } from "@refinedev/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import type { Invitation } from "better-auth/client"
import React from "react"
import { DeleteButton } from "@/components/refine-ui/buttons/delete"
import { ShowButton } from "@/components/refine-ui/buttons/show"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import {
    ListView,
    ListViewHeader,
} from "@/components/refine-ui/views/list-view"

export const InvitationList = () => {
    const columns = React.useMemo(() => {
        const columnHelper = createColumnHelper<Invitation>()

        return [
            columnHelper.accessor("id", {
                id: "id",
                enableSorting: true,
                header: "ID",
            }),
            columnHelper.accessor("email", {
                id: "email",
                header: "Email",
                enableSorting: true,
            }),
            columnHelper.accessor("role", {
                id: "role",
                header: "Role",
                enableSorting: true,
            }),
            columnHelper.accessor("status", {
                id: "status",
                header: "Status",
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
            columnHelper.accessor("expiresAt", {
                id: "expiresAt",
                header: "Expires At",
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
                        <DeleteButton
                            recordItemId={row.original.id}
                            size="sm"
                            resource="invitations"
                            dataProviderName="invitation"
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
            resource: "invitations",
            syncWithLocation: true,
            dataProviderName: "invitation",
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
