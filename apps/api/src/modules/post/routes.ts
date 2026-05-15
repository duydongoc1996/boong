import { eq } from "drizzle-orm"
import { Elysia } from "elysia"
import z from "zod"
import { createOne } from "@/common/crud/create-one"
import { deleteMany } from "@/common/crud/delete-many"
import { findMany, getLimitOffset } from "@/common/crud/find-many"
import { findOne } from "@/common/crud/find-one"
import { updateMany } from "@/common/crud/update-many"
import { macroOrg } from "@/common/plugins/org"
import { db } from "@/database/db"
import { post } from "@/database/schemas"

export const postRoutes = new Elysia({ prefix: "/posts" })
    .use(macroOrg)
    .get(
        "/",
        async () => {
            const { limit, offset } = getLimitOffset(1, 10)

            const posts = await findMany(db, post, {
                limit,
                offset,
                orderBy: [
                    {
                        column: "createdAt",
                        direction: "asc",
                    },
                ],
            })

            return {
                data: posts.rows,
                total: posts.total,
            }
        },
        {
            withOrg: true,
        }
    )
    .get(
        "/:id",
        async ({ params }) => {
            const { row } = await findOne(db, post, {
                where: eq(post.id, params.id),
            })
            return {
                data: row,
            }
        },
        {
            withOrg: true,
        }
    )
    .post(
        "/",
        async ({ body, orgId }) => {
            const { row } = await createOne(db, post, {
                value: {
                    ...body,
                    orgId,
                },
            })
            return {
                data: row,
            }
        },
        {
            body: z.object({
                title: z.string(),
                content: z.string(),
            }),
            // headers: z.object({
            //     "x-org-id": z.string(),
            // }),
            withOrg: true,
        }
    )
    .patch(
        "/:id",
        async ({ params, body }) => {
            const { rows } = await updateMany(db, post, {
                where: eq(post.id, params.id),
                value: body,
            })
            return {
                data: rows[0] || null,
            }
        },
        {
            body: z.object({
                title: z.string(),
                content: z.string(),
                orgId: z.string(),
            }),
        }
    )
    .delete("/:id", async ({ params }) => {
        const { rows } = await deleteMany(db, post, {
            where: eq(post.id, params.id),
        })
        console.debug(
            "Deleted rows:",
            rows.map((row) => row.id)
        )
        return {
            data: null,
        }
    })
