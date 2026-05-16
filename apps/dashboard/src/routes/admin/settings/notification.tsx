import { useI18nContext } from "@boong/i18n"
import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/admin/settings/notification")({
    staticData: breadcrumbI18n("settingsNotification"),
    component: Page,
})

function Page() {
    const { LL } = useI18nContext()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{LL.admin.settings.notification.title()}</CardTitle>
                <CardDescription>
                    {LL.admin.settings.notification.description()}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
