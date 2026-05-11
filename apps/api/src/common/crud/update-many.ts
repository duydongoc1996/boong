import type { InferSelectModel } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DbExecutor, UpdateManyOptions, UpdateManyResult } from "./types"

export async function updateMany<
    TSchema extends Record<string, unknown>,
    TTable extends PgTable,
>(
    db: DbExecutor<TSchema>,
    table: TTable,
    options: UpdateManyOptions<TTable>
): Promise<UpdateManyResult<TTable>> {
    const rows = (await db
        .update(table as PgTable)
        .set(options.value)
        .where(options.where)
        .returning()) as InferSelectModel<TTable>[]

    return { rows }
}
