import {
    createFileRoute,
    notFound,
    Outlet,
    redirect,
} from "@tanstack/react-router"
import { DashboardShell } from "@/components/layout/dashboard/dashboard-shell"
import { authClient } from "@/lib/auth-client"
import { listSessionOrganizations } from "@/lib/auth-org"
import { breadcrumbLoader } from "@/lib/router-static-data"

export const Route = createFileRoute("/$orgSlug")({
    staticData: breadcrumbLoader("org"),
    beforeLoad: async () => {
        const session = await authClient.getSession()
        if (!session.data?.session) {
            throw redirect({ to: "/signin" })
        }
    },
    loader: async ({ params }) => {
        const orgs = await listSessionOrganizations()
        const org = orgs.find((o) => o.slug === params.orgSlug)
        if (!org) {
            throw notFound()
        }
        return { org, orgId: org.id }
    },
    component: OrgWorkspaceLayout,
})

function OrgWorkspaceLayout() {
    return (
        <DashboardShell>
            <Outlet />
        </DashboardShell>
    )
}
