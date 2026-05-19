import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Table } from "@tanstack/react-table"
import { Trash2, UserCheck, UserX } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { admin } from "@/data-provider/auth-provider"
import type { User } from "../data/schema"
import { UsersMultiDeleteDialog } from "./users-multi-delete-dialog"

type Props<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({ table }: Props<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const queryClient = useQueryClient()

    const banMutation = useMutation({
        mutationFn: async (action: "ban" | "unban") => {
            const ids = selectedRows.map((row) => (row.original as User).id)
            const results = await Promise.allSettled(
                ids.map((userId) =>
                    action === "ban"
                        ? admin.banUser({ userId })
                        : admin.unbanUser({ userId })
                )
            )
            const failed = results.filter(
                (r) => r.status === "rejected" || r.value?.error
            )
            return {
                total: ids.length,
                failed: failed.length,
                action,
            }
        },
        onSuccess: ({ total, failed, action }) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
            table.resetRowSelection()
            const ok = total - failed
            const verb = action === "ban" ? "Banned" : "Unbanned"
            toast.success(
                failed
                    ? `${verb} ${ok} of ${total} users (${failed} failed).`
                    : `${verb} ${ok} user${ok > 1 ? "s" : ""}.`
            )
        },
        onError: (err: Error) => {
            toast.error(err.message)
        },
    })

    return (
        <>
            <BulkActionsToolbar table={table} entityName="user">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => banMutation.mutate("unban")}
                            className="size-8"
                            aria-label="Unban selected users"
                            title="Unban selected users"
                        >
                            <UserCheck />
                            <span className="sr-only">
                                Unban selected users
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Unban selected users</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => banMutation.mutate("ban")}
                            className="size-8"
                            aria-label="Ban selected users"
                            title="Ban selected users"
                        >
                            <UserX />
                            <span className="sr-only">Ban selected users</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ban selected users</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="size-8"
                            aria-label="Delete selected users"
                            title="Delete selected users"
                        >
                            <Trash2 />
                            <span className="sr-only">
                                Delete selected users
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete selected users</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <UsersMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
