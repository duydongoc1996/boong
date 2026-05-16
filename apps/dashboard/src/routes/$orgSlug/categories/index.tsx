import { createFileRoute } from "@tanstack/react-router"
import { CategoriesListRouteView } from "@/components/resource/categories-list-route-view"
import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/$orgSlug/categories/")({
    staticData: breadcrumbI18n("categories"),
    component: CategoriesListRouteView,
})
