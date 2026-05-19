import { toast } from "sonner"

export class HttpError extends Error {
    status: number
    data: unknown

    constructor(message: string, status: number, data?: unknown) {
        super(message)
        this.name = "HttpError"
        this.status = status
        this.data = data
    }
}

export function handleServerError(error: unknown) {
    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(error)
    }

    let errMsg = "Something went wrong!"

    if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        Number(error.status) === 204
    ) {
        errMsg = "No content."
    }

    if (error instanceof HttpError) {
        const data = error.data
        if (data && typeof data === "object" && "title" in data) {
            const title = (data as { title: unknown }).title
            if (typeof title === "string" && title.length > 0) {
                errMsg = title
            }
        }
    }

    toast.error(errMsg)
}
