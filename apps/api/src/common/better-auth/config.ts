import type { BetterAuthOptions } from "better-auth"
import { openAPI, organization } from "better-auth/plugins"

export const BETTER_AUTH_CONFIG = {
    emailAndPassword: {
        enabled: true,
    },
    plugins: [organization(), openAPI()],
} satisfies BetterAuthOptions
