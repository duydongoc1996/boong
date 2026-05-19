import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { Users } from "@/features/users"

const usersSearchSchema = z.object({
    page: z.number().optional().catch(1),
    pageSize: z.number().optional().catch(10),
    status: z
        .array(z.union([z.literal("active"), z.literal("banned")]))
        .optional()
        .catch([]),
    role: z
        .array(z.union([z.literal("admin"), z.literal("user")]))
        .optional()
        .catch([]),
    name: z.string().optional().catch(""),
})

export const Route = createFileRoute("/_authenticated/admin/users/")({
    validateSearch: usersSearchSchema,
    component: Users,
})
