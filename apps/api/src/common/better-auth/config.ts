import { i18n } from "@better-auth/i18n"
import type { BetterAuthOptions } from "better-auth"
import { multiSession, openAPI, organization } from "better-auth/plugins"
import { config } from "../plugins/config"

export const BETTER_AUTH_CONFIG = {
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: config.ALLOWED_ORIGINS,
    plugins: [
        organization(),
        openAPI(),
        multiSession(),
        i18n({
            translations: {
                vn: {
                    USER_NOT_FOUND: "Người dùng không tồn tại",
                    INVALID_EMAIL_OR_PASSWORD:
                        "Email hoặc mật khẩu không hợp lệ",
                    INVALID_PASSWORD: "Mật khẩu không hợp lệ",
                    CREDENTIAL_ACCOUNT_NOT_FOUND: "Tài khoản không tồn tại",
                    EMAIL_NOT_VERIFIED: "Email chưa được xác thực",
                    SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn",
                },
            },
        }),
    ],
    advanced: {
        database: {
            generateId: false,
        },
    },
} satisfies BetterAuthOptions
