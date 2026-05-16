import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { RouteBreadcrumbConfig } from "@/lib/breadcrumb"
import { routeTree } from "./routeTree.gen"
import "./index.css"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
        },
    },
})

const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
    interface StaticDataRouteOption {
        breadcrumb?: RouteBreadcrumbConfig
    }
}

const el = document.getElementById("root")
if (el) {
    createRoot(el).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <I18nProvider>
                    <TooltipProvider>
                        <RouterProvider router={router} />
                    </TooltipProvider>
                </I18nProvider>
            </QueryClientProvider>
        </StrictMode>
    )
}
