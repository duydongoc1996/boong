import { createFileRoute, redirect } from "@tanstack/react-router"
import { AdminShell } from "@/components/layout/admin/admin-shell"
import { authClient } from "@/lib/auth-client"
import { breadcrumbI18n } from "@/lib/breadcrumb"

export const Route = createFileRoute("/admin")({
    staticData: breadcrumbI18n("admin"),
    beforeLoad: async () => {
        const s = await authClient.getSession()
        if (!s.data?.session) {
            throw redirect({ to: "/signin" })
        }
        const role = (s.data.user as { role?: string }).role
        if (role !== "admin") {
            throw redirect({ to: "/home" })
        }
    },
    component: AdminShell,
})
