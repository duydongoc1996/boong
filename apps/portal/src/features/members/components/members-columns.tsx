import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MemberRow, MemberRowStatus } from "../data/schema"
import { DataTableRowActions } from "./data-table-row-actions"

const statusStyles: Record<MemberRowStatus, string> = {
    joined: "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
    pending: "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
    canceled: "bg-neutral-300/40 border-neutral-300",
    rejected:
        "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
}

const statusLabel: Record<MemberRowStatus, string> = {
    joined: "Joined",
    pending: "Invited",
    canceled: "Canceled",
    rejected: "Rejected",
}

function getInitials(name?: string | null, email?: string) {
    const source = name ?? email ?? ""
    if (!source) return "?"
    return source
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("")
}

export const membersColumns: ColumnDef<MemberRow>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
            const { email, name, image } = row.original
            return (
                <div className="flex items-center gap-2 ps-3">
                    <Avatar className="h-7 w-7 rounded-full">
                        <AvatarImage
                            src={image ?? undefined}
                            alt={name ?? email}
                        />
                        <AvatarFallback className="rounded-full text-xs">
                            {getInitials(name, email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium leading-tight">
                            {name ?? "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {email}
                        </span>
                    </div>
                </div>
            )
        },
        enableHiding: false,
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
            <span className="text-sm capitalize">{row.getValue("role")}</span>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue<MemberRowStatus>("status")
            return (
                <Badge
                    variant="outline"
                    className={cn("capitalize", statusStyles[status])}
                >
                    {statusLabel[status]}
                </Badge>
            )
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "invitedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="When" />
        ),
        accessorFn: (row) => row.joinedAt ?? row.invitedAt,
        cell: ({ row }) => {
            const date = row.original.joinedAt ?? row.original.invitedAt
            return (
                <div className="text-sm text-muted-foreground">
                    {date ? date.toLocaleDateString() : "—"}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: DataTableRowActions,
    },
]
