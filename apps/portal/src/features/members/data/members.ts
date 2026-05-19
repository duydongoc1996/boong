import { useQuery } from "@tanstack/react-query"
import { organization } from "@/data-provider/auth-provider"
import type { MemberRow, OrgRole } from "./schema"

export const membersQueryKey = (orgId: string | undefined) =>
    ["org", "members", orgId ?? "none"] as const

type Member = {
    id: string
    role: OrgRole
    createdAt: Date | string
    user: {
        id: string
        email: string
        name?: string
        image?: string | null
    }
}

type Invitation = {
    id: string
    email: string
    role: OrgRole
    status: "pending" | "accepted" | "rejected" | "canceled"
    inviterId?: string
    expiresAt?: Date | string
    createdAt?: Date | string
}

const invitationPriority: Record<Invitation["status"], number> = {
    pending: 0,
    canceled: 1,
    rejected: 2,
    accepted: 3,
}

function mergeRows(members: Member[], invitations: Invitation[]): MemberRow[] {
    const byEmail = new Map<string, MemberRow>()

    for (const m of members) {
        const email = m.user.email
        byEmail.set(email, {
            email,
            name: m.user.name,
            image: m.user.image ?? null,
            role: m.role,
            status: "joined",
            memberId: m.id,
            joinedAt: new Date(m.createdAt),
        })
    }

    const grouped = new Map<string, Invitation>()
    for (const inv of invitations) {
        const existing = grouped.get(inv.email)
        if (!existing) {
            grouped.set(inv.email, inv)
            continue
        }
        if (
            invitationPriority[inv.status] < invitationPriority[existing.status]
        ) {
            grouped.set(inv.email, inv)
            continue
        }
        if (
            invitationPriority[inv.status] ===
            invitationPriority[existing.status]
        ) {
            const a = new Date(inv.createdAt ?? 0).getTime()
            const b = new Date(existing.createdAt ?? 0).getTime()
            if (a > b) grouped.set(inv.email, inv)
        }
    }

    for (const inv of grouped.values()) {
        if (byEmail.has(inv.email)) continue
        if (inv.status === "accepted") continue
        byEmail.set(inv.email, {
            email: inv.email,
            role: inv.role,
            status: inv.status,
            invitationId: inv.id,
            invitedBy: inv.inviterId,
            invitedAt: inv.createdAt ? new Date(inv.createdAt) : undefined,
            expiresAt: inv.expiresAt ? new Date(inv.expiresAt) : undefined,
        })
    }

    return Array.from(byEmail.values()).sort((a, b) => {
        if (a.status === b.status) return a.email.localeCompare(b.email)
        const order: MemberRow["status"][] = [
            "joined",
            "pending",
            "canceled",
            "rejected",
        ]
        return order.indexOf(a.status) - order.indexOf(b.status)
    })
}

export function useMembersQuery(orgId: string | undefined) {
    return useQuery({
        queryKey: membersQueryKey(orgId),
        enabled: !!orgId,
        queryFn: async () => {
            const [m, i] = await Promise.all([
                organization.listMembers({ query: { organizationId: orgId } }),
                organization.listInvitations({
                    query: { organizationId: orgId },
                }),
            ])
            if (m.error) {
                throw new Error(m.error.message ?? "Failed to load members.")
            }
            if (i.error) {
                throw new Error(
                    i.error.message ?? "Failed to load invitations."
                )
            }
            const members = (m.data?.members ?? []) as unknown as Member[]
            const invitations = (i.data ?? []) as unknown as Invitation[]
            return mergeRows(members, invitations)
        },
    })
}
