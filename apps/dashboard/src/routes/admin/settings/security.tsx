import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/admin/settings/security")({
    staticData: breadcrumbI18n("settingsSecurity"),
    component: Page,
})

function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                    Reserved for session policies, IP rules, and audit logs.
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
