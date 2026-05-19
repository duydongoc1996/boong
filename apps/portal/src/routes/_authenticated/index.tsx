import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { useListOrganizations } from "@/data-provider/auth-provider"

export const Route = createFileRoute("/_authenticated/")({
    component: HomeRedirect,
})

function HomeRedirect() {
    const { data: orgs, isPending } = useListOrganizations()
    const navigate = useNavigate()

    useEffect(() => {
        const slug = orgs?.[0]?.slug
        if (slug) {
            navigate({
                to: "/org/$orgId",
                params: { orgId: slug },
                replace: true,
            })
        }
    }, [orgs, navigate])

    if (isPending) {
        return <div className="p-6 text-muted-foreground">Loading…</div>
    }
    if (!orgs || orgs.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold">No organizations yet</h2>
                <p className="text-muted-foreground">
                    Ask an admin to invite you, or create one to get started.
                </p>
            </div>
        )
    }
    return null
}
