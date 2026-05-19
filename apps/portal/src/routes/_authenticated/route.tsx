import { createFileRoute, redirect } from "@tanstack/react-router"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { authClient } from "@/data-provider/auth-provider"

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ location }) => {
        const { data } = await authClient.getSession()
        if (!data) {
            throw redirect({
                to: "/sign-in",
                search: { redirect: location.href },
            })
        }
    },
    component: AuthenticatedLayout,
})
