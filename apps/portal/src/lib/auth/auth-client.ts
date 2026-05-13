import {
    multiSessionClient,
    organizationClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const apiUrl = import.meta.env.VITE_API_URL as string | undefined
const authOrigin = apiUrl?.replace(/\/api\/?$/, "") ?? "http://localhost:4000"

export const authClient = createAuthClient({
    baseURL: authOrigin,
    plugins: [organizationClient(), multiSessionClient()],
})
