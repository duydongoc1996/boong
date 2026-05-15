import type { TranslationFunctions } from "@boong/i18n"

export type BreadcrumbLoaderResolve = "org"

export type RouteBreadcrumbConfig =
    | { kind: "i18n"; key: BreadcrumbI18nKey }
    | { kind: "loader"; resolve: BreadcrumbLoaderResolve }

export function breadcrumbI18n(key: BreadcrumbI18nKey) {
    return {
        breadcrumb: { kind: "i18n", key } satisfies RouteBreadcrumbConfig,
    }
}

export function breadcrumbLoader(resolve: BreadcrumbLoaderResolve) {
    return {
        breadcrumb: { kind: "loader", resolve } satisfies RouteBreadcrumbConfig,
    }
}

export type OrgRouteLoaderData = {
    org: { name: string; slug: string }
    orgId: string
}

export type BreadcrumbI18nKey = keyof TranslationFunctions["breadcrumb"]

/** Resolve a breadcrumb i18n key to a localized label. */
export function translateBreadcrumb(
    LL: TranslationFunctions,
    key: BreadcrumbI18nKey
): string {
    return LL.breadcrumb[key]()
}
