import { useI18nContext } from "@boong/i18n"
import { Link, type LinkProps, useMatches } from "@tanstack/react-router"
import { Fragment } from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { OrgRouteLoaderData } from "@/lib/router-static-data"
import { translateBreadcrumb } from "@/lib/router-static-data"

function resolveLoaderBreadcrumb(
    resolve: "org",
    loaderData: unknown
): string | undefined {
    if (resolve !== "org") {
        return undefined
    }
    const data = loaderData as OrgRouteLoaderData | undefined
    return data?.org?.name
}

export function AppBreadcrumb() {
    const { LL } = useI18nContext()
    const matches = useMatches()

    const crumbs = matches
        .filter((match) => match.staticData?.breadcrumb)
        .map((match) => {
            const config = match.staticData!.breadcrumb!
            let label: string | undefined

            if (config.kind === "i18n") {
                label = translateBreadcrumb(LL, config.key)
            } else {
                label = resolveLoaderBreadcrumb(
                    config.resolve,
                    match.loaderData
                )
            }

            return {
                id: match.id,
                to: match.fullPath,
                label,
            }
        })
        .filter((crumb): crumb is typeof crumb & { label: string } =>
            Boolean(crumb.label)
        )

    if (crumbs.length === 0) {
        return null
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1

                    return (
                        <Fragment key={crumb.id}>
                            {index > 0 ? <BreadcrumbSeparator /> : null}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {crumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={crumb.to as LinkProps["to"]}>
                                            {crumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
