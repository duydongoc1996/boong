import { useQuery } from "@tanstack/react-query"
import { admin } from "@/data-provider/auth-provider"
import type { User, UserStatus } from "./schema"

type ListUsersQuery = {
    limit?: number
    offset?: number
    searchValue?: string
    searchField?: "email" | "name"
    sortBy?: string
    sortDirection?: "asc" | "desc"
}

export const usersQueryKey = (params: ListUsersQuery = {}) =>
    ["admin", "users", params] as const

function toUser(record: Record<string, unknown>): User {
    const banned = Boolean(record.banned)
    return {
        id: String(record.id),
        name: String(record.name ?? ""),
        email: String(record.email ?? ""),
        emailVerified: Boolean(record.emailVerified),
        image: (record.image as string | null | undefined) ?? null,
        role: ((record.role as string) ?? "user") as User["role"],
        banned,
        banReason: (record.banReason as string | null | undefined) ?? null,
        createdAt: new Date(record.createdAt as string | number | Date),
        updatedAt: new Date(record.updatedAt as string | number | Date),
    }
}

export function statusFor(user: User): UserStatus {
    return user.banned ? "banned" : "active"
}

export function useUsersQuery(params: ListUsersQuery = {}) {
    return useQuery({
        queryKey: usersQueryKey(params),
        queryFn: async () => {
            const result = await admin.listUsers({ query: params })
            if (result.error) {
                throw new Error(result.error.message ?? "Failed to load users.")
            }
            const records = (result.data?.users ?? []) as unknown as Record<
                string,
                unknown
            >[]
            return {
                users: records.map(toUser),
                total: (result.data?.total as number | undefined) ?? 0,
            }
        },
    })
}
