import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { LongText } from "@/components/long-text"
import { cn } from "@/lib/utils"
import type { Organization } from "../data/schema"
import { DataTableRowActions } from "./data-table-row-actions"

export const organizationsColumns: ColumnDef<Organization>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
            <LongText className="max-w-48 ps-3">
                {row.getValue("name")}
            </LongText>
        ),
        meta: {
            className: cn(
                "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
                "inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none"
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: "slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => (
            <div className="w-fit ps-2 text-nowrap font-mono text-xs">
                {row.getValue("slug")}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
            const value = row.getValue<Date>("createdAt")
            return (
                <div className="text-sm text-muted-foreground">
                    {value.toLocaleDateString()}
                </div>
            )
        },
        enableSorting: true,
    },
    {
        id: "actions",
        cell: DataTableRowActions,
    },
]
