import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/$orgSlug/members/")({
    staticData: breadcrumbI18n("members"),
    component: MembersPage,
})

function MembersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                    Organization membership management will connect to Better
                    Auth organization APIs when you extend this route.
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
