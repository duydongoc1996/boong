import { getApiBasePath } from "@/lib/env"

export type ApiListResult<T> = {
    data: T[]
    total: number | null
}

export class ApiError extends Error {
    status: number
    code?: string
    body: unknown

    constructor(message: string, status: number, body: unknown, code?: string) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.code = code
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
        const message =
            typeof body?.message === "string" ? body.message : res.statusText
        const code = typeof body?.code === "string" ? body.code : undefined
        throw new ApiError(message, res.status, body, code)
    }
    return body as T
}
