import type { InferSelectModel } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DbExecutor, DeleteManyOptions, DeleteManyResult } from "./types"

export async function deleteMany<
    TSchema extends Record<string, unknown>,
    TTable extends PgTable,
>(
    db: DbExecutor<TSchema>,
    table: TTable,
    options: DeleteManyOptions<TTable>
): Promise<DeleteManyResult<TTable>> {
    const rows = (await db
        .delete(table as PgTable)
        .where(options.where)
        .returning()) as InferSelectModel<TTable>[]

    return { rows }
}
