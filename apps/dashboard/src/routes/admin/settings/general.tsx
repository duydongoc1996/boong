import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/admin/settings/general")({
    staticData: breadcrumbI18n("settingsGeneral"),
    component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                    Placeholder for global admin preferences (branding, locale,
                    etc.).
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
