import { useI18nContext } from "@boong/i18n"
import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/$orgSlug/invitations/")({
    staticData: breadcrumbI18n("invitations"),
    component: InvitationsPage,
})

function InvitationsPage() {
    const { LL } = useI18nContext()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{LL.invitations.title()}</CardTitle>
                <CardDescription>
                    {LL.invitations.description()}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
