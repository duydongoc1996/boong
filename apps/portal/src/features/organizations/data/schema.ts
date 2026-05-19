import { z } from "zod"

const _organizationSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    logo: z.string().nullable().optional(),
    metadata: z.unknown().optional(),
    createdAt: z.coerce.date(),
})
export type Organization = z.infer<typeof _organizationSchema>
