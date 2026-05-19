import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { organization } from "@/data-provider/auth-provider"
import type { Organization } from "../data/schema"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Organization
}

export function OrganizationsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const [value, setValue] = useState("")
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            const r = await organization.delete({
                organizationId: currentRow.id,
            })
            if (r.error) {
                throw new Error(
                    r.error.message ?? "Could not delete organization."
                )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "organizations"],
            })
            toast.success("Organization deleted.")
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
            form="organizations-delete-form"
            disabled={value.trim() !== currentRow.slug || mutation.isPending}
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{" "}
                    Delete Organization
                </span>
            }
            desc={
                <form
                    id="organizations-delete-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (value.trim() === currentRow.slug) mutation.mutate()
                    }}
                    className="space-y-4"
                >
                    <p className="mb-2">
                        Are you sure you want to delete{" "}
                        <span className="font-bold">{currentRow.name}</span>?
                        <br />
                        Members will lose access to its data. This cannot be
                        undone.
                    </p>

                    <Label className="my-2">
                        Slug:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Type "${currentRow.slug}" to confirm.`}
                            autoFocus
                        />
                    </Label>

                    <Alert variant="destructive">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            This operation cannot be rolled back.
                        </AlertDescription>
                    </Alert>
                </form>
            }
            confirmText="Delete"
            destructive
        />
    )
}
