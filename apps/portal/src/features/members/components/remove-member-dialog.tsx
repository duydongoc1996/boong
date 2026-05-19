import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { organization } from "@/data-provider/auth-provider"
import { membersQueryKey } from "../data/members"
import type { MemberRow } from "../data/schema"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MemberRow
    organizationId: string
}

export function RemoveMemberDialog({
    open,
    onOpenChange,
    currentRow,
    organizationId,
}: Props) {
    const [value, setValue] = useState("")
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            const r = await organization.removeMember({
                memberIdOrEmail: currentRow.email,
                organizationId,
            })
            if (r.error) {
                throw new Error(r.error.message ?? "Could not remove member.")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: membersQueryKey(organizationId),
            })
            toast.success("Member removed.")
            setValue("")
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
            form="remove-member-form"
            disabled={value.trim() !== currentRow.email || mutation.isPending}
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{" "}
                    Remove member
                </span>
            }
            desc={
                <form
                    id="remove-member-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (value.trim() === currentRow.email) {
                            mutation.mutate()
                        }
                    }}
                    className="space-y-4"
                >
                    <p>
                        Remove{" "}
                        <span className="font-bold">
                            {currentRow.name ?? currentRow.email}
                        </span>{" "}
                        from this organization? They'll lose access immediately.
                    </p>
                    <Label className="my-2">
                        Email:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter email to confirm."
                            autoFocus
                        />
                    </Label>
                    <Alert variant="destructive">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            This cannot be rolled back.
                        </AlertDescription>
                    </Alert>
                </form>
            }
            confirmText="Remove"
            destructive
        />
    )
}
