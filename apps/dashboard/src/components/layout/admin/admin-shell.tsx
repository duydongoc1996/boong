import { Outlet, useRouterState } from "@tanstack/react-router"
import { AdminHeader } from "@/components/layout/admin/admin-header"
import { AdminSidebar } from "@/components/layout/admin/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AdminShell() {
    const pathname = useRouterState({ select: (s) => s.location.pathname })

    return (
        <SidebarProvider>
            <AdminSidebar currentPath={pathname} />
            <SidebarInset>
                <AdminHeader />
                <main className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
