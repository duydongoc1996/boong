import { useGetIdentity } from "@refinedev/core"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type UserIdentity = {
    id: number | string
    name?: string
    avatar?: string
}

export function UserAvatar() {
    const { data: user, isLoading: userIsLoading } =
        useGetIdentity<UserIdentity>()

    if (userIsLoading || !user) {
        return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />
    }

    const displayName = user.name ?? ""
    const { avatar } = user

    return (
        <Avatar className={cn("h-10", "w-10")}>
            {avatar && <AvatarImage src={avatar} alt={displayName || "User"} />}
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
    )
}

const getInitials = (name = "") => {
    const names = name.trim().split(/\s+/).filter(Boolean)
    if (names.length === 0) return "?"
    const first = names[0]?.substring(0, 1).toUpperCase() ?? ""
    if (names.length === 1) return first || "?"
    const last = names[names.length - 1]?.substring(0, 1).toUpperCase() ?? ""
    return `${first}${last}` || "?"
}

UserAvatar.displayName = "UserAvatar"
