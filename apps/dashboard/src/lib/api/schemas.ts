import { z } from "zod"

export const postRowSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    orgId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type PostRow = z.infer<typeof postRowSchema>

export const categoryRowSchema = z.object({
    id: z.string(),
    name: z.string(),
    orgId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type CategoryRow = z.infer<typeof categoryRowSchema>

export const listEnvelopeSchema = <T extends z.ZodTypeAny>(item: T) =>
    z.object({
        data: z.array(item),
        total: z.number().nullable(),
    })
