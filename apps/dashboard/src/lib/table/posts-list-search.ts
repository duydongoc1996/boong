import { z } from "zod"

/** Values TanStack Router may pass for a missing query key. */
const looseQuery = z.union([
    z.undefined(),
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
])

function intSearch(defaultVal: number, min: number) {
    return looseQuery.transform((v) => {
        if (v === undefined || v === null || v === "") return defaultVal
        const n = typeof v === "number" ? v : Number(String(v))
        if (!Number.isFinite(n)) return defaultVal
        const i = Math.trunc(n)
        return i < min ? defaultVal : i
    })
}

export const postsListSearchSchema = z.object({
    page: intSearch(1, 1),
    size: intSearch(10, 1),
    q: looseQuery.transform((v) => (v == null ? "" : String(v))),
    sort: looseQuery.transform((v) =>
        v == null || v === "" ? "createdAt" : String(v)
    ),
    dir: looseQuery.transform((v) => (v === "desc" ? "desc" : "asc")),
})

export type PostsListSearch = z.infer<typeof postsListSearchSchema>

/** Use when linking or navigating to `/$orgSlug/posts` without URL search params. */
export const postsListSearchDefaults: PostsListSearch = {
    page: 1,
    size: 10,
    q: "",
    sort: "createdAt",
    dir: "asc",
}
