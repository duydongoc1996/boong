import type { InferSelectModel } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DbExecutor, ReadTableOptions, ReadTableResult } from "./types"

export async function read<
    TSchema extends Record<string, unknown>,
    TTable extends PgTable,
>(
    db: DbExecutor<TSchema>,
    table: TTable,
    options: ReadTableOptions<TTable>
): Promise<ReadTableResult<TTable>> {
    const { where } = options

    const rows = (await db
        .select()
        .from(table as PgTable)
        .where(where)
        .limit(1)
        .execute()) as InferSelectModel<TTable>[]

    return { row: rows[0] ?? null }
}
