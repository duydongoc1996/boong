import type * as schema from "../schemas/index.js"
import type { connectDatabase, generateID } from "./connect.js"

export type DbSchema = typeof schema
export type DbConnection = ReturnType<typeof connectDatabase<DbSchema>>["db"]
export type QueryClient = ReturnType<
    typeof connectDatabase<DbSchema>
>["queryClient"]
export type ID = ReturnType<typeof generateID>
