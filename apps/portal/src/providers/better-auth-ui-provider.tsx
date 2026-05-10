import type { ComponentType, PropsWithChildren } from "react"
import { forwardRef } from "react"
import { Link as RouterLink, useNavigate } from "react-router"

import { AuthProvider } from "@/components/auth/auth-provider"
import { useTheme } from "@/components/refine-ui/theme/theme-provider"
import { authClient } from "@/lib/auth/auth-client"
import { themePlugin } from "@/lib/auth/theme-plugin"

/**
 * Better Auth UI passes `href`; React Router's `Link` navigates from `to` and overwrites
 * `href` on the `<a>`. Forward `href` → `to` so register/forgot-password links resolve correctly.
 */
const AuthLink = forwardRef<
    HTMLAnchorElement,
    PropsWithChildren<{ className?: string; href: string; to?: string }>
>(function AuthLink({ href, to, ...props }, ref) {
    return <RouterLink ref={ref} to={to ?? href} {...props} />
})

/**
 * Bridges Better Auth UI (`AuthProvider`) with React Router navigation/refine-ui theme.
 * Must render under `BrowserRouter` and `ThemeProvider`.
 */
export function BetterAuthUIProvider({ children }: PropsWithChildren) {
    const navigate = useNavigate()
    const themeApi = useTheme()

    return (
        <AuthProvider
            authClient={authClient}
            navigate={({ to, replace }) =>
                replace ? navigate(to, { replace: true }) : navigate(to)
            }
            Link={
                AuthLink as ComponentType<
                    PropsWithChildren<{
                        className?: string
                        href: string
                        to?: string
                    }>
                >
            }
            basePaths={{
                auth: "",
                settings: "/settings",
                organization: "/organization",
            }}
            viewPaths={{
                auth: {
                    signIn: "sign-in",
                    signUp: "sign-up",
                    forgotPassword: "forgot-password",
                    resetPassword: "reset-password",
                    signOut: "sign-out",
                },
            }}
            baseURL={
                typeof window !== "undefined" ? window.location.origin : ""
            }
            plugins={[
                themePlugin({
                    useTheme: () => ({
                        theme: themeApi.theme,
                        setTheme: (value: string) =>
                            themeApi.setTheme(value as typeof themeApi.theme),
                    }),
                }),
            ]}
            emailAndPassword={{
                name: false,
            }}
            socialProviders={["google"]}
        >
            {children}
        </AuthProvider>
    )
}
