import { z } from "zod"

const userRoleSchema = z.union([z.literal("admin"), z.literal("user")])
export type UserRole = z.infer<typeof userRoleSchema>

const userStatusSchema = z.union([z.literal("active"), z.literal("banned")])
export type UserStatus = z.infer<typeof userStatusSchema>

const _userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean().optional(),
    image: z.string().nullable().optional(),
    role: userRoleSchema,
    banned: z.boolean().optional(),
    banReason: z.string().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof _userSchema>
