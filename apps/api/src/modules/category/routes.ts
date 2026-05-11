import { eq } from "drizzle-orm"
import { Elysia } from "elysia"
import z from "zod"
import { createOne } from "@/common/crud/create-one"
import { deleteMany } from "@/common/crud/delete-many"
import { findMany, getLimitOffset } from "@/common/crud/find-many"
import { findOne } from "@/common/crud/find-one"
import { updateMany } from "@/common/crud/update-many"
import { db } from "@/database/db"
import { category } from "@/database/schemas"

export const categoryRoutes = new Elysia({ prefix: "/categories" })
    .get("/", async () => {
        const { limit, offset } = getLimitOffset(1, 10)

        const categories = await findMany(db, category, {
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
            data: categories.rows,
            total: categories.total,
        }
    })
    .get("/:id", async ({ params }) => {
        const { row } = await findOne(db, category, {
            where: eq(category.id, params.id),
        })
        return {
            data: row,
        }
    })
    .post(
        "/",
        async ({ body }) => {
            const { row } = await createOne(db, category, {
                value: body,
            })
            return {
                data: row,
            }
        },
        {
            body: z.object({
                name: z.string(),
                orgId: z.string(),
            }),
        }
    )
    .patch(
        "/:id",
        async ({ params, body }) => {
            const { rows } = await updateMany(db, category, {
                where: eq(category.id, params.id),
                value: body,
            })
            return {
                data: rows[0] || null,
            }
        },
        {
            body: z.object({
                name: z.string(),
                orgId: z.string(),
            }),
        }
    )
    .delete("/:id", async ({ params }) => {
        const { rows } = await deleteMany(db, category, {
            where: eq(category.id, params.id),
        })
        console.debug(
            "Deleted rows:",
            rows.map((row) => row.id)
        )
        return {
            data: null,
        }
    })
