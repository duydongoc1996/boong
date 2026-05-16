import type { TranslationFunctions } from "@boong/i18n"

type ErrorsNamespace = TranslationFunctions["errors"]

/**
 * Keys in the `errors` namespace whose translator takes no arguments.
 * Parameterized messages (e.g. validationMinLength) are excluded so the
 * dynamic `LL.errors[code]()` call type-checks.
 */
export type ErrorCodeKey = {
    [K in keyof ErrorsNamespace]: ErrorsNamespace[K] extends () => string
        ? K
        : never
}[keyof ErrorsNamespace]

/**
 * Maps known third-party / API error codes to keys in the `errors` namespace.
 * Add entries here as the API and Better Auth surface new codes.
 */
const ERROR_CODE_MAP: Record<string, ErrorCodeKey> = {
    INVALID_EMAIL_OR_PASSWORD: "invalidCredentials",
    INVALID_PASSWORD: "invalidCredentials",
    USER_NOT_FOUND: "invalidCredentials",
    EMAIL_NOT_VERIFIED: "unauthorized",
    UNAUTHORIZED: "unauthorized",
    FORBIDDEN: "forbidden",
    NOT_FOUND: "notFound",
    INVALID_INPUT: "invalidInput",
    VALIDATION_ERROR: "invalidInput",
    NETWORK_ERROR: "network",
    SLUG_INVALID: "slugInvalid",
}

type ErrorLike = {
    code?: string
    message?: string
    status?: number
    body?: { code?: string; message?: string } | null
}

function asErrorLike(err: unknown): ErrorLike | null {
    if (err && typeof err === "object") {
        return err as ErrorLike
    }
    return null
}

function isErrorCodeKey(
    errors: ErrorsNamespace,
    key: string
): key is ErrorCodeKey {
    const entry = (errors as Record<string, unknown>)[key]
    return (
        typeof entry === "function" &&
        (entry as (...a: unknown[]) => unknown).length === 0
    )
}

/**
 * Resolve a localized error message from an unknown error value.
 *
 * Resolution order:
 *  1. Translation keyed by mapped error code (ERROR_CODE_MAP)
 *  2. Translation keyed by raw error code (when the code matches an `errors` key)
 *  3. Translation for the HTTP status (401 / 403 / 404 / 5xx)
 *  4. Raw `message` from the error or its body
 *  5. The fallback key
 */
export function translateError(
    LL: TranslationFunctions,
    err: unknown,
    fallbackKey: ErrorCodeKey = "fallback"
): string {
    const e = asErrorLike(err)
    if (!e) {
        return LL.errors[fallbackKey]()
    }

    const code = e.code ?? e.body?.code
    if (code) {
        const mapped = ERROR_CODE_MAP[code]
        if (mapped) {
            return LL.errors[mapped]()
        }
        if (isErrorCodeKey(LL.errors, code)) {
            return LL.errors[code]()
        }
    }

    if (typeof e.status === "number") {
        if (e.status === 401) return LL.errors.unauthorized()
        if (e.status === 403) return LL.errors.forbidden()
        if (e.status === 404) return LL.errors.notFound()
        if (e.status >= 500) return LL.errors.serverError()
    }

    const msg = e.message ?? e.body?.message
    if (typeof msg === "string" && msg.length > 0) {
        return msg
    }

    return LL.errors[fallbackKey]()
}
