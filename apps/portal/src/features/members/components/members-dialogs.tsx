import { CancelInvitationDialog } from "./cancel-invitation-dialog"
import { InviteMemberDialog } from "./invite-member-dialog"
import { useMembers } from "./members-provider"
import { RemoveMemberDialog } from "./remove-member-dialog"
import { UpdateRoleDialog } from "./update-role-dialog"

type Props = {
    organizationId: string
}

export function MembersDialogs({ organizationId }: Props) {
    const { open, setOpen, currentRow, setCurrentRow } = useMembers()

    return (
        <>
            <InviteMemberDialog
                key="invite"
                open={open === "invite"}
                onOpenChange={() => setOpen("invite")}
                organizationId={organizationId}
            />

            {currentRow && (
                <>
                    <CancelInvitationDialog
                        key={`cancel-${currentRow.invitationId ?? currentRow.email}`}
                        open={open === "cancel"}
                        onOpenChange={() => {
                            setOpen("cancel")
                            setTimeout(() => setCurrentRow(null), 500)
                        }}
                        currentRow={currentRow}
                        organizationId={organizationId}
                    />
                    <UpdateRoleDialog
                        key={`update-role-${currentRow.memberId ?? currentRow.email}`}
                        open={open === "update-role"}
                        onOpenChange={() => {
                            setOpen("update-role")
                            setTimeout(() => setCurrentRow(null), 500)
                        }}
                        currentRow={currentRow}
                        organizationId={organizationId}
                    />
                    <RemoveMemberDialog
                        key={`remove-${currentRow.memberId ?? currentRow.email}`}
                        open={open === "remove"}
                        onOpenChange={() => {
                            setOpen("remove")
                            setTimeout(() => setCurrentRow(null), 500)
                        }}
                        currentRow={currentRow}
                        organizationId={organizationId}
                    />
                </>
            )}
        </>
    )
}
