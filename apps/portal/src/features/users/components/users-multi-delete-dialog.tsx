import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Table } from "@tanstack/react-table"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { admin } from "@/data-provider/auth-provider"
import type { User } from "../data/schema"

type Props<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

const CONFIRM_WORD = "DELETE"

export function UsersMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: Props<TData>) {
    const [value, setValue] = useState("")
    const queryClient = useQueryClient()

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const mutation = useMutation({
        mutationFn: async () => {
            const ids = selectedRows.map((row) => (row.original as User).id)
            const results = await Promise.allSettled(
                ids.map((userId) => admin.removeUser({ userId }))
            )
            const failed = results.filter(
                (r) => r.status === "rejected" || r.value?.error
            )
            if (failed.length > 0) {
                throw new Error(
                    `Failed to delete ${failed.length} of ${ids.length} users.`
                )
            }
            return ids.length
        },
        onSuccess: (count) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
            table.resetRowSelection()
            setValue("")
            onOpenChange(false)
            toast.success(`Deleted ${count} user${count > 1 ? "s" : ""}.`)
        },
        onError: (err: Error) => {
            toast.error(err.message)
        },
    })

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            form="users-multi-delete-form"
            disabled={value.trim() !== CONFIRM_WORD || mutation.isPending}
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{" "}
                    Delete {selectedRows.length}{" "}
                    {selectedRows.length > 1 ? "users" : "user"}
                </span>
            }
            desc={
                <form
                    id="users-multi-delete-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (value.trim() === CONFIRM_WORD) mutation.mutate()
                    }}
                    className="space-y-4"
                >
                    <p className="mb-2">
                        Are you sure you want to delete the selected users?{" "}
                        <br />
                        This action cannot be undone.
                    </p>

                    <Label className="my-4 flex flex-col items-start gap-1.5">
                        <span>Confirm by typing "{CONFIRM_WORD}":</span>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
                            autoFocus
                        />
                    </Label>

                    <Alert variant="destructive">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            Please be careful, this operation can not be rolled
                            back.
                        </AlertDescription>
                    </Alert>
                </form>
            }
            confirmText="Delete"
            destructive
        />
    )
}
