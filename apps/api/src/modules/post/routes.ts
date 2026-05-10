import { Elysia } from "elysia"
import { getLimitOffset, paginate } from "@/common/crud/browse"
import { db } from "@/database/db"
import { post } from "@/database/schemas"

export const postRoutes = new Elysia({ prefix: "/posts" }).get(
    "/",
    async () => {
        const { limit, offset } = getLimitOffset(1, 10)

        const posts = await paginate(db, post, {
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
            message: "Posts fetched successfully",
            data: posts.rows,
            total: posts.total,
        }
    }
)
