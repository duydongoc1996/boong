import type { TranslationFunctions } from "@boong/i18n"

export type BreadcrumbI18nKey = keyof TranslationFunctions["breadcrumb"]

export type BreadcrumbLoaderResolve = "org"

export type RouteBreadcrumbConfig =
    | { kind: "i18n"; key: BreadcrumbI18nKey }
    | { kind: "loader"; resolve: BreadcrumbLoaderResolve }

export type OrgRouteLoaderData = {
    org: { name: string; slug: string }
    orgId: string
}

/** Route `staticData` for a breadcrumb whose label comes from an i18n key. */
export function breadcrumbI18n(key: BreadcrumbI18nKey) {
    return {
        breadcrumb: { kind: "i18n", key } satisfies RouteBreadcrumbConfig,
    }
}

/** Route `staticData` for a breadcrumb whose label is derived from loader data. */
export function breadcrumbLoader(resolve: BreadcrumbLoaderResolve) {
    return {
        breadcrumb: { kind: "loader", resolve } satisfies RouteBreadcrumbConfig,
    }
}
