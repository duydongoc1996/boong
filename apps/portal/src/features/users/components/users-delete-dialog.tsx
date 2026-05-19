import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { admin } from "@/data-provider/auth-provider"
import type { User } from "../data/schema"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
    const [value, setValue] = useState("")
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            const r = await admin.removeUser({ userId: currentRow.id })
            if (r.error) {
                throw new Error(r.error.message ?? "Could not remove user.")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
            toast.success("User deleted.")
            onOpenChange(false)
        },
        onError: (err: Error) => {
            toast.error(err.message)
        },
    })

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            form="users-delete-form"
            disabled={value.trim() !== currentRow.email || mutation.isPending}
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{" "}
                    Delete User
                </span>
            }
            desc={
                <form
                    id="users-delete-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (value.trim() === currentRow.email) {
                            mutation.mutate()
                        }
                    }}
                    className="space-y-4"
                >
                    <p className="mb-2">
                        Are you sure you want to delete{" "}
                        <span className="font-bold">{currentRow.email}</span>?
                        <br />
                        This will permanently remove the user with the role of{" "}
                        <span className="font-bold">
                            {currentRow.role.toUpperCase()}
                        </span>{" "}
                        from the system. This cannot be undone.
                    </p>

                    <Label className="my-2">
                        Email:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter email to confirm deletion."
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
