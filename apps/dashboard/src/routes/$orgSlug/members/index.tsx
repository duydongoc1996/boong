import { useI18nContext } from "@boong/i18n"
import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/$orgSlug/members/")({
    staticData: breadcrumbI18n("members"),
    component: MembersPage,
})

function MembersPage() {
    const { LL } = useI18nContext()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{LL.members.title()}</CardTitle>
                <CardDescription>{LL.members.description()}</CardDescription>
            </CardHeader>
        </Card>
    )
}
