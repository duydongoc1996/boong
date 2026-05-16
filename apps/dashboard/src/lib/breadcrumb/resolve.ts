import type { TranslationFunctions } from "@boong/i18n"
import type {
    BreadcrumbLoaderResolve,
    OrgRouteLoaderData,
    RouteBreadcrumbConfig,
} from "./config"

function isOrgRouteLoaderData(value: unknown): value is OrgRouteLoaderData {
    if (!value || typeof value !== "object") {
        return false
    }
    const v = value as Record<string, unknown>
    if (typeof v.orgId !== "string") {
        return false
    }
    const org = v.org
    if (!org || typeof org !== "object") {
        return false
    }
    const o = org as Record<string, unknown>
    return typeof o.name === "string" && typeof o.slug === "string"
}

function resolveLoaderLabel(
    resolve: BreadcrumbLoaderResolve,
    loaderData: unknown
): string | undefined {
    switch (resolve) {
        case "org":
            return isOrgRouteLoaderData(loaderData)
                ? loaderData.org.name
                : undefined
    }
}

/**
 * Resolve a route match's breadcrumb config to a localized label.
 * Returns `undefined` when the route has no breadcrumb config or the
 * loader data cannot satisfy the requested resolver.
 */
export function resolveBreadcrumbLabel(
    config: RouteBreadcrumbConfig | undefined,
    loaderData: unknown,
    LL: TranslationFunctions
): string | undefined {
    if (!config) {
        return undefined
    }
    switch (config.kind) {
        case "i18n":
            return LL.breadcrumb[config.key]()
        case "loader":
            return resolveLoaderLabel(config.resolve, loaderData)
    }
}
