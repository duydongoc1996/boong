import { Outlet, useParams } from "@tanstack/react-router"
import { DashboardHeader } from "@/components/layout/dashboard/dashboard-header"
import { OrgDashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardShell({ children }: { children?: React.ReactNode }) {
    const params = useParams({ strict: false }) as { orgSlug?: string }
    const orgSlug = params.orgSlug

    return (
        <SidebarProvider>
            <OrgDashboardSidebar orgSlug={orgSlug ?? ""} />
            <SidebarInset>
                <DashboardHeader />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children ?? <Outlet />}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
