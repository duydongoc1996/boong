import { createFileRoute } from "@tanstack/react-router"
import { AdminOrganizationsPage } from "@/components/admin/admin-organizations-page"
import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/admin/organizations/")({
    staticData: breadcrumbI18n("organizations"),
    component: AdminOrganizationsPage,
})
