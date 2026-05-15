import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/admin/settings/notification")({
    staticData: breadcrumbI18n("settingsNotification"),
    component: Page,
})

function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification settings</CardTitle>
                <CardDescription>
                    Reserved for future email and webhook settings.
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
