import { adminClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { getPublicApiOrigin } from "@/lib/env"

export const authClient = createAuthClient({
    baseURL: getPublicApiOrigin(),
    plugins: [adminClient(), organizationClient()],
})

export type Session = typeof authClient.$Infer.Session
