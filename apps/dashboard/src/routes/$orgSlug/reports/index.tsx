import { createFileRoute } from "@tanstack/react-router"
import { ChartAreaInteractive } from "@/components/chart/chart-1"
import { ChartBarMultiple } from "@/components/chart/chart-2"
import { ChartPieLabel } from "@/components/chart/chart-3"

import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/$orgSlug/reports/")({
    staticData: breadcrumbI18n("reports"),
    component: ReportsPage,
})

function ReportsPage() {
    return (
        <>
            <div className="grid gap-4 lg:grid-cols-1">
                <ChartAreaInteractive />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <ChartBarMultiple />
                <ChartPieLabel />
            </div>
        </>
    )
}
