import { api } from "@/config/api"

/**
 * Placeholder for the Elysia REST data provider.
 *
 * Once eden-treaty is wired up, replace this with:
 *
 *   import { treaty } from "@elysiajs/eden"
 *   import type { Api } from "@boong/api/types"
 *   export const rest = treaty<Api>(api.base)
 *
 * Resource modules should consume `rest` and stay type-safe end-to-end.
 */
export const rest = {
    baseURL: api.base,
} as const

export type RestClient = typeof rest
