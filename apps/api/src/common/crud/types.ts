import type { InferInsertModel, InferSelectModel, SQL } from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

/** DB (or transaction) surface required by {@link paginatedSelect}. */
export type DbExecutor<TSchema extends Record<string, unknown>> =
    PostgresJsDatabase<TSchema>

/** Keys that correspond to real columns on `TTable` (Drizzle table config). */
export type ColumnNames<TTable extends PgTable> = keyof TTable["_"]["columns"] &
    string

/** Sort Types */
export type SortDirection = "asc" | "desc"
export type SortColumns<TTable extends PgTable> = {
    column: ColumnNames<TTable>
    direction: SortDirection
}

/** Browse Types */
export type FindManyOptions<TTable extends PgTable> = {
    /**
     * Filter rows. Pass a built `SQL` fragment, or a callback that receives
     * the column map from {@link getTableColumns} so filters stay column-typed.
     */
    where?: SQL | ((columns: TTable["_"]["columns"]) => SQL | undefined)
    /** Applied in order; each column must exist on the table. */
    orderBy?: SortColumns<TTable>[]
    limit: number
    offset?: number
    /**
     * When true (default), runs {@link PostgresJsDatabase.$count} with the same filter
     * so callers can compute total pages.
     */
    withTotal?: boolean
}

export type FindManyResult<TTable extends PgTable> = {
    rows: InferSelectModel<TTable>[]
    total: number | null
}

/** Read Types */
export type FindOneOptions<TTable extends PgTable> = {
    where?: SQL | ((columns: TTable["_"]["columns"]) => SQL | undefined)
}

export type FindOneResult<TTable extends PgTable> = {
    row: InferSelectModel<TTable> | null
}

export type CreateOneOptions<TTable extends PgTable> = {
    value: InferInsertModel<TTable>
}

export type CreateOneResult<TTable extends PgTable> = {
    row: InferInsertModel<TTable>
}

export type UpdateManyOptions<TTable extends PgTable> = {
    where?: SQL
    value: Partial<InferSelectModel<TTable>>
}

export type UpdateManyResult<TTable extends PgTable> = {
    rows: InferSelectModel<TTable>[]
}

export type DeleteManyOptions<TTable extends PgTable> = {
    where?: SQL
}

export type DeleteManyResult<TTable extends PgTable> = {
    rows: InferSelectModel<TTable>[]
}
