import type { HttpError } from "@refinedev/core"

export function isMethodWithBody(method: string): boolean {
    return ["post", "patch", "put", "delete"].includes(method.toLowerCase())
}

/**
 * Helper to handle fetch responses and errors
 */
export async function handleResponse(response: Response) {
    const responseData = await response.json()

    if (!response.ok) {
        const error: HttpError = {
            message: responseData?.message || response.statusText,
            statusCode: response.status,
        }
        return Promise.reject(error)
    }

    return { response, responseData }
}
