import type { AuthProvider } from "@refinedev/core"
import { authClient } from "@/lib/auth/auth-client"

const notViaRefine = {
    success: false as const,
    error: {
        name: "AuthUIOnly",
        message: "Use the Better Auth UI pages for sign-in and registration.",
    },
}

export const authProvider: AuthProvider = {
    /** Refine requires this hook; all credential flows use Better Auth UI. */
    login: async () => notViaRefine,

    logout: async () => {
        try {
            await authClient.signOut({
                fetchOptions: { throw: true, credentials: "include" },
            })
        } catch {
            // Still route away so the shell matches client state.
        }
        return { success: true, redirectTo: "/sign-in" }
    },

    check: async () => {
        try {
            const res = await authClient.getSession({
                fetchOptions: { throw: false, credentials: "include" },
            })
            if (res.data?.user) {
                return { authenticated: true }
            }
        } catch {
            // treated as logged out
        }
        return {
            authenticated: false,
            redirectTo: "/sign-in",
        }
    },

    getPermissions: async () => null,

    getIdentity: async () => {
        try {
            const res = await authClient.getSession({
                fetchOptions: { throw: false, credentials: "include" },
            })
            const user = res.data?.user
            if (!user) return null
            return {
                id: user.id,
                name: user.name ?? user.email,
                avatar: user.image ?? undefined,
            }
        } catch {
            return null
        }
    },

    onError: async (error) => {
        console.error(error)
        return { error }
    },

    register: async () => notViaRefine,

    forgotPassword: async () => notViaRefine,
}
