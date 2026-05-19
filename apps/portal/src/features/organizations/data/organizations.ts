import { useQuery } from "@tanstack/react-query"
import { organization } from "@/data-provider/auth-provider"
import type { Organization } from "./schema"

export const organizationsQueryKey = () => ["admin", "organizations"] as const

function toOrganization(record: Record<string, unknown>): Organization {
    return {
        id: String(record.id),
        name: String(record.name ?? ""),
        slug: String(record.slug ?? ""),
        logo: (record.logo as string | null | undefined) ?? null,
        metadata: record.metadata,
        createdAt: new Date(record.createdAt as string | number | Date),
    }
}

export function useOrganizationsQuery() {
    return useQuery({
        queryKey: organizationsQueryKey(),
        queryFn: async () => {
            const result = await organization.list()
            if (result.error) {
                throw new Error(
                    result.error.message ?? "Failed to load organizations."
                )
            }
            const records = (result.data ?? []) as unknown as Record<
                string,
                unknown
            >[]
            return records.map(toOrganization)
        },
    })
}
