import { getPublicApiOrigin } from "@/lib/env"

const authApi = () => `${getPublicApiOrigin()}/api/auth`

export type ListedOrg = {
    id: string
    name: string
    slug: string
    logo?: string | null
}

/** Calls Better Auth organization list (session cookie). */
export async function listSessionOrganizations(): Promise<ListedOrg[]> {
    const res = await fetch(`${authApi()}/organization/list`, {
        credentials: "include",
        headers: { Accept: "application/json" },
    })
    if (!res.ok) {
        throw new Error(`organization/list failed: ${res.status}`)
    }
    const body = (await res.json()) as unknown
    if (Array.isArray(body)) {
        return body as ListedOrg[]
    }
    if (
        body &&
        typeof body === "object" &&
        "organizations" in body &&
        Array.isArray((body as { organizations: ListedOrg[] }).organizations)
    ) {
        return (body as { organizations: ListedOrg[] }).organizations
    }
    if (
        body &&
        typeof body === "object" &&
        "data" in body &&
        Array.isArray((body as { data: ListedOrg[] }).data)
    ) {
        return (body as { data: ListedOrg[] }).data
    }
    return []
}

export async function setActiveOrganization(organizationId: string) {
    const res = await fetch(`${authApi()}/organization/set-active`, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId }),
    })
    if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `set-active failed: ${res.status}`)
    }
}
