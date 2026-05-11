import type { BetterAuthOptions } from "better-auth"
import { openAPI, organization } from "better-auth/plugins"
import { config } from "../plugins/config"

export const BETTER_AUTH_CONFIG = {
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: config.ALLOWED_ORIGINS,
    plugins: [organization(), openAPI()],
    advanced: {
        database: {
            generateId: false,
        },
    },
} satisfies BetterAuthOptions
