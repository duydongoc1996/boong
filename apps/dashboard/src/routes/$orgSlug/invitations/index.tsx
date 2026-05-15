import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/$orgSlug/invitations/")({
    staticData: breadcrumbI18n("invitations"),
    component: InvitationsPage,
})

function InvitationsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Invitations</CardTitle>
                <CardDescription>
                    Invitation flows will plug into Better Auth organization
                    invitations here.
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
