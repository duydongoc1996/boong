import { getApiBasePath } from "@/lib/env"

export type ApiListResult<T> = {
    data: T[]
    total: number | null
}

export class ApiError extends Error {
    status: number
    body: unknown

    constructor(message: string, status: number, body: unknown) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.body = body
    }
}

export async function apiFetch<T>(
    path: string,
    init: RequestInit & { orgId?: string } = {}
): Promise<T> {
    const { orgId, headers: hdrs, ...rest } = init
    const headers = new Headers(hdrs)
    headers.set("Accept", "application/json")
    if (orgId) {
        headers.set("x-org-id", orgId)
    }
    const res = await fetch(`${getApiBasePath()}${path}`, {
        credentials: "include",
        ...rest,
        headers,
    })
    const text = await res.text()
    const body = text ? JSON.parse(text) : null
    if (!res.ok) {
        throw new ApiError(
            typeof body?.message === "string" ? body.message : res.statusText,
            res.status,
            body
        )
    }
    return body as T
}
