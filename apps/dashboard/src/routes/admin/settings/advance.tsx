import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/admin/settings/advance")({
    staticData: breadcrumbI18n("settingsAdvance"),
    component: Page,
})

function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Advanced</CardTitle>
                <CardDescription>
                    Reserved for power-user options and experimental toggles.
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
