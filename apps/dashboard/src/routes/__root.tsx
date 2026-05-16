import { useI18nContext } from "@boong/i18n"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
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
    const { LL } = useI18nContext()
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6">
            <h1 className="text-2xl font-semibold">{LL.notFound.title()}</h1>
            <p className="text-muted-foreground text-sm">
                {LL.notFound.description()}
            </p>
            <a className="text-primary text-sm underline" href="/">
                {LL.notFound.home()}
            </a>
        </div>
    )
}

function RootLayout() {
    return (
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
    )
}
