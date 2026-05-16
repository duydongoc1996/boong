import { useI18nContext } from "@boong/i18n"
import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/admin/settings/advance")({
    staticData: breadcrumbI18n("settingsAdvance"),
    component: Page,
})

function Page() {
    const { LL } = useI18nContext()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{LL.admin.settings.advance.title()}</CardTitle>
                <CardDescription>
                    {LL.admin.settings.advance.description()}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
