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
import { resolveBreadcrumbLabel } from "@/lib/breadcrumb"

export function AppBreadcrumb() {
    const { LL } = useI18nContext()
    const matches = useMatches()

    const crumbs = matches.flatMap((match) => {
        const label = resolveBreadcrumbLabel(
            match.staticData?.breadcrumb,
            match.loaderData,
            LL
        )
        if (!label) {
            return []
        }
        return [{ id: match.id, to: match.fullPath, label }]
    })

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
