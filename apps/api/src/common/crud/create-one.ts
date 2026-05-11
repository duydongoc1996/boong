import type { InferInsertModel } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { CreateOneOptions, CreateOneResult, DbExecutor } from "./types"

export async function createOne<
    TSchema extends Record<string, unknown>,
    TTable extends PgTable,
>(
    db: DbExecutor<TSchema>,
    table: TTable,
    options: CreateOneOptions<TTable>
): Promise<CreateOneResult<TTable>> {
    const [row] = (await db
        .insert(table)
        .values(options.value)
        .returning()) as InferInsertModel<TTable>[]

    if (!row) {
        throw new Error("Failed to add row")
    }

    return { row }
}
