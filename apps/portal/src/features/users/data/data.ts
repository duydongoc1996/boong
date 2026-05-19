import { Shield, UserCheck } from "lucide-react"
import type { UserStatus } from "./schema"

export const callTypes = new Map<UserStatus, string>([
    [
        "active",
        "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
    ],
    [
        "banned",
        "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
    ],
])

export const roles = [
    {
        label: "Admin",
        value: "admin",
        icon: Shield,
    },
    {
        label: "User",
        value: "user",
        icon: UserCheck,
    },
] as const
