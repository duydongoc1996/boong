import { MailPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMembers } from "./members-provider"

type Props = {
    canInvite: boolean
}

export function MembersPrimaryButtons({ canInvite }: Props) {
    const { setOpen } = useMembers()
    if (!canInvite) return null
    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen("invite")}>
                <span>Invite member</span> <MailPlus size={18} />
            </Button>
        </div>
    )
}
