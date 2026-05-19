import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { authClient } from "@/data-provider/auth-provider"

export const Route = createFileRoute("/_authenticated/admin")({
    beforeLoad: async () => {
        const { data } = await authClient.getSession()
        const role = (data?.user as { role?: string } | undefined)?.role
        if (role !== "admin") {
            throw redirect({
                to: "/errors/$error",
                params: { error: "forbidden" },
            })
        }
    },
    component: () => <Outlet />,
})
