import { useTable } from "@refinedev/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import type { Member, User } from "better-auth/client"
import React from "react"
import { DeleteButton } from "@/components/refine-ui/buttons/delete"
import { EditButton } from "@/components/refine-ui/buttons/edit"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import {
    ListView,
    ListViewHeader,
} from "@/components/refine-ui/views/list-view"

export const MemberList = () => {
    const columns = React.useMemo(() => {
        const columnHelper = createColumnHelper<Member & { user: User }>()

        return [
            columnHelper.accessor("id", {
                id: "id",
                enableSorting: true,
                header: "ID",
            }),
            columnHelper.accessor("user.email", {
                id: "email",
                header: "Email",
                enableSorting: true,
            }),
            columnHelper.accessor("role", {
                id: "role",
                header: "Role",
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
                        <DeleteButton
                            recordItemId={row.original.id}
                            size="sm"
                            resource="members"
                            dataProviderName="member"
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
            resource: "members",
            syncWithLocation: true,
            dataProviderName: "member",
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
