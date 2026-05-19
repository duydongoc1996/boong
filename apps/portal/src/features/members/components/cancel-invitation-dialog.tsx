import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Ban } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { organization } from "@/data-provider/auth-provider"
import { membersQueryKey } from "../data/members"
import type { MemberRow } from "../data/schema"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MemberRow
    organizationId: string
}

export function CancelInvitationDialog({
    open,
    onOpenChange,
    currentRow,
    organizationId,
}: Props) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            if (!currentRow.invitationId) {
                throw new Error("No invitation to cancel.")
            }
            const r = await organization.cancelInvitation({
                invitationId: currentRow.invitationId,
            })
            if (r.error) {
                throw new Error(
                    r.error.message ?? "Could not cancel invitation."
                )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: membersQueryKey(organizationId),
            })
            toast.success("Invitation canceled.")
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
            disabled={mutation.isPending}
            handleConfirm={() => mutation.mutate()}
            title={
                <span className="text-destructive">
                    <Ban
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />{" "}
                    Cancel invitation
                </span>
            }
            desc={
                <p>
                    Cancel the invitation sent to{" "}
                    <span className="font-bold">{currentRow.email}</span>? They
                    will no longer be able to accept it.
                </p>
            }
            confirmText="Cancel invitation"
            cancelBtnText="Keep"
            destructive
        />
    )
}
