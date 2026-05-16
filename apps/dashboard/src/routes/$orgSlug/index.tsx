import { useI18nContext } from "@boong/i18n"
import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const orgApi = getRouteApi("/$orgSlug")

export const Route = createFileRoute("/$orgSlug/")({
    component: OrgHome,
})

function OrgHome() {
    const { LL } = useI18nContext()
    const { org } = orgApi.useLoaderData()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>
                    {LL.orgWorkspace.description({ slug: org.slug })}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
