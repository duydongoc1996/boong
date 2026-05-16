import { useI18nContext } from "@boong/i18n"
import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/admin/settings/general")({
    staticData: breadcrumbI18n("settingsGeneral"),
    component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
    const { LL } = useI18nContext()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{LL.admin.settings.general.title()}</CardTitle>
                <CardDescription>
                    {LL.admin.settings.general.description()}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
