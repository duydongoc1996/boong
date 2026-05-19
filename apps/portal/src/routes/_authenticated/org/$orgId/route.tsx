import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { organization } from "@/data-provider/auth-provider"

export const Route = createFileRoute("/_authenticated/org/$orgId")({
    component: OrgLayout,
})

function OrgLayout() {
    const { orgId } = Route.useParams()
    useEffect(() => {
        void organization.setActive({ organizationSlug: orgId })
    }, [orgId])
    return <Outlet />
}
