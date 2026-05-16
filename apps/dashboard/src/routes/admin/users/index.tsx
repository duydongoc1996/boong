import { createFileRoute } from "@tanstack/react-router"
import { AdminUsersPage } from "@/components/admin/admin-users-page"
import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/admin/users/")({
    staticData: breadcrumbI18n("users"),
    component: AdminUsersPage,
})
