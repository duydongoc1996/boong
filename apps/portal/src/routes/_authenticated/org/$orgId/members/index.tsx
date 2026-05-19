import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { Members } from "@/features/members"

const membersSearchSchema = z.object({
    page: z.number().optional().catch(1),
    pageSize: z.number().optional().catch(10),
    email: z.string().optional().catch(""),
    status: z
        .array(
            z.union([
                z.literal("member"),
                z.literal("pending"),
                z.literal("canceled"),
                z.literal("rejected"),
            ])
        )
        .optional()
        .catch([]),
    role: z
        .array(
            z.union([
                z.literal("owner"),
                z.literal("admin"),
                z.literal("member"),
            ])
        )
        .optional()
        .catch([]),
})

export const Route = createFileRoute("/_authenticated/org/$orgId/members/")({
    validateSearch: membersSearchSchema,
    component: Members,
})
