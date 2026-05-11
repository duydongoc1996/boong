import type { InferSelectModel } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DbExecutor, FindOneOptions, FindOneResult } from "./types"

export async function findOne<
    TSchema extends Record<string, unknown>,
    TTable extends PgTable,
>(
    db: DbExecutor<TSchema>,
    table: TTable,
    options: FindOneOptions<TTable>
): Promise<FindOneResult<TTable>> {
    const { where } = options

    const rows = (await db
        .select()
        .from(table as PgTable)
        .where(where)
        .limit(1)
        .execute()) as InferSelectModel<TTable>[]

    return { row: rows[0] ?? null }
}
