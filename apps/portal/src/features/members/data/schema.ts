import { z } from "zod"

export const orgRoleSchema = z.union([
    z.literal("owner"),
    z.literal("admin"),
    z.literal("member"),
])
export type OrgRole = z.infer<typeof orgRoleSchema>

export const memberRowStatusSchema = z.union([
    z.literal("joined"),
    z.literal("pending"),
    z.literal("canceled"),
    z.literal("rejected"),
])
export type MemberRowStatus = z.infer<typeof memberRowStatusSchema>

const _memberRowSchema = z.object({
    email: z.string(),
    name: z.string().optional(),
    image: z.string().nullable().optional(),
    role: orgRoleSchema,
    status: memberRowStatusSchema,
    memberId: z.string().optional(),
    invitationId: z.string().optional(),
    invitedBy: z.string().optional(),
    joinedAt: z.coerce.date().optional(),
    invitedAt: z.coerce.date().optional(),
    expiresAt: z.coerce.date().optional(),
})
export type MemberRow = z.infer<typeof _memberRowSchema>
