import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export interface RouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
    notFoundComponent: NotFound,
})

function NotFound() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-muted-foreground text-sm">
                Check the URL or return home.
            </p>
            <a className="text-primary text-sm underline" href="/">
                Home
            </a>
        </div>
    )
}

function RootLayout() {
    return (
        <NuqsAdapter>
            <ThemeProvider>
                <TooltipProvider delayDuration={200}>
                    <Outlet />
                    <Toaster richColors position="top-center" />
                    {import.meta.env.DEV ? (
                        <TanStackDevtools
                            plugins={[
                                {
                                    name: "TanStack Query",
                                    render: (
                                        <ReactQueryDevtools buttonPosition="bottom-right" />
                                    ),
                                },
                                {
                                    name: "TanStack Router",
                                    render: (
                                        <TanStackRouterDevtools position="bottom-right" />
                                    ),
                                },
                            ]}
                        />
                    ) : null}
                </TooltipProvider>
            </ThemeProvider>
        </NuqsAdapter>
    )
}
