import { useCallback, useEffect, useMemo, useRef } from "react"
import { authClient } from "@/lib/auth/auth-client"

export type ActiveOrgSummary = {
    id: string
    name: string
    role?: string
}

export function useOrg() {
    const session = authClient.useSession()
    const list = authClient.useListOrganizations()
    const activeFull = authClient.useActiveOrganization()
    const activeRole = authClient.useActiveMemberRole()

    const organizations = list.data ?? []
    const sessionActiveId = session.data?.session?.activeOrganizationId ?? null

    const activeOrg: ActiveOrgSummary | null = useMemo(() => {
        const full = activeFull.data
        const role = activeRole.data?.role
        if (full) {
            return { id: full.id, name: full.name, role }
        }
        if (sessionActiveId) {
            const fromList = organizations.find((o) => o.id === sessionActiveId)
            if (fromList) {
                return { id: fromList.id, name: fromList.name, role }
            }
        }
        return null
    }, [activeFull.data, activeRole.data?.role, organizations, sessionActiveId])

    const isLoading =
        session.isPending ||
        list.isPending ||
        activeFull.isPending ||
        activeRole.isPending

    const didAutoSelect = useRef(false)
    useEffect(() => {
        if (didAutoSelect.current) return
        if (session.isPending || list.isPending) return
        if (organizations.length === 0) return
        if (sessionActiveId) {
            didAutoSelect.current = true
            return
        }
        const first = organizations[0]
        if (!first) return
        didAutoSelect.current = true
        void authClient.organization.setActive({
            organizationId: first.id,
        })
    }, [session.isPending, list.isPending, organizations, sessionActiveId])

    useEffect(() => {
        if (!session.data?.user) {
            didAutoSelect.current = false
        }
    }, [session.data?.user])

    const setOrgId = useCallback(
        async (organizationId: string) => {
            await authClient.organization.setActive({
                organizationId,
            })
            await session.refetch()
            await list.refetch()
            await activeFull.refetch()
            await activeRole.refetch()
        },
        [session, list, activeFull, activeRole]
    )

    const orgId = activeOrg?.id ?? sessionActiveId

    const metaHeaders = useMemo(() => {
        if (!orgId) return undefined
        return { "x-org-id": orgId }
    }, [orgId])

    return {
        organizations,
        activeOrg,
        orgId,
        setOrgId,
        isLoading,
        metaHeaders,
    }
}
