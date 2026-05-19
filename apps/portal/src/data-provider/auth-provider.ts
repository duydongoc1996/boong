import {
    adminClient,
    multiSessionClient,
    organizationClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { api } from "@/config/api"

export const authClient = createAuthClient({
    baseURL: api.auth,
    plugins: [adminClient(), organizationClient(), multiSessionClient()],
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
