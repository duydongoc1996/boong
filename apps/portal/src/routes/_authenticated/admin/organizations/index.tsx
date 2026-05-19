import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { Organizations } from "@/features/organizations"

const orgsSearchSchema = z.object({
    page: z.number().optional().catch(1),
    pageSize: z.number().optional().catch(10),
    name: z.string().optional().catch(""),
})

export const Route = createFileRoute("/_authenticated/admin/organizations/")({
    validateSearch: orgsSearchSchema,
    component: Organizations,
})
