import {
    adminClient,
    multiSessionClient,
    organizationClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { api } from "@/config/api"

export const authClient = createAuthClient({
    baseURL: api.auth,
    plugins: [adminClient(), organizationClient({}), multiSessionClient()],
})

export const {
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    resetPassword,
    useSession,
    useListOrganizations,
    useActiveOrganization,
    useActiveMember,
    organization,
    admin,
} = authClient

export type AuthClient = typeof authClient
export type Session =
    ReturnType<AuthClient["useSession"]> extends {
        data: infer D | null | undefined
    }
        ? D
        : never

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

/**
 * Force a refetch of every session-scoped atom in the auth client.
 *
 * better-auth's `useListOrganizations` is bound to `$listOrg`, which only
 * refreshes on org CRUD — not on sign-in/sign-out. Without this, switching
 * accounts leaves the previous user's org list in the switcher. Call this
 * after sign-out and after a successful sign-in.
 */
export function resetAuthAtoms() {
    const signals = [
        "$sessionSignal",
        "$listOrg",
        "$activeOrgSignal",
        "$activeMemberSignal",
        "$activeMemberRoleSignal",
    ] as const
    for (const signal of signals) {
        try {
            authClient.$store.notify(signal)
        } catch {
            // signal isn't registered (plugin not loaded) — safe to ignore
        }
    }
}
