import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { DashboardShell } from "@/components/layout/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { listSessionOrganizations } from "@/lib/auth-org"
import { breadcrumbI18n } from "@/lib/router-static-data"
import { postsListSearchDefaults } from "@/lib/table/posts-list-search"

export const Route = createFileRoute("/home")({
    staticData: breadcrumbI18n("home"),
    beforeLoad: async () => {
        const session = await authClient.getSession()
        if (!session.data?.session) {
            throw redirect({ to: "/" })
        }
    },
    component: HomePage,
})

function HomePage() {
    const orgsQuery = useQuery({
        queryKey: ["organizations"],
        queryFn: listSessionOrganizations,
    })

    const firstOrgSlug = orgsQuery.data?.[0]?.slug

    if (orgsQuery.isPending) {
        return (
            <DashboardShell>
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Home</h1>
                    <p className="text-muted-foreground text-sm">
                        Pick an area from the sidebar to get started.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {firstOrgSlug ? (
                        <>
                            <Button asChild>
                                <Link
                                    to="/$orgSlug/posts"
                                    params={{ orgSlug: firstOrgSlug }}
                                    search={postsListSearchDefaults}
                                >
                                    Open posts
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link
                                    to="/$orgSlug/categories"
                                    params={{ orgSlug: firstOrgSlug }}
                                >
                                    Open categories
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <Button asChild>
                            <Link to="/admin/organizations">
                                Create an organization
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </DashboardShell>
    )
}
