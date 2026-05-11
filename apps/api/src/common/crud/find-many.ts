import {
    asc,
    desc,
    getTableColumns,
    type InferSelectModel,
    type SQL,
} from "drizzle-orm"
import type { PgTable } from "drizzle-orm/pg-core"
import type { DbExecutor, FindManyOptions, FindManyResult } from "./types"

function buildWhere<TTable extends PgTable>(
    table: TTable,
    where: FindManyOptions<TTable>["where"]
): SQL | undefined {
    if (where === undefined) {
        return undefined
    }
    if (typeof where === "function") {
        return where(getTableColumns(table))
    }
    return where
}

function buildOrderBy<TTable extends PgTable>(
    table: TTable,
    orderBy: FindManyOptions<TTable>["orderBy"]
): SQL[] | undefined {
    if (orderBy === undefined || orderBy.length === 0) {
        return undefined
    }
    const columns = getTableColumns(table)
    return orderBy.map((spec) => {
        const column = columns[spec.column]
        if (column === undefined) {
            throw new Error(`Unknown column for sort: ${spec.column}`)
        }
        return spec.direction === "asc" ? asc(column) : desc(column)
    })
}

/**
 * Typed `select` + pagination: dynamic `where`, `orderBy`, `limit`/`offset`, and optional total count via `$count`.
 */
export async function findMany<
    TSchema extends Record<string, unknown>,
    TTable extends PgTable,
>(
    db: DbExecutor<TSchema>,
    table: TTable,
    options: FindManyOptions<TTable>
): Promise<FindManyResult<TTable>> {
    const { limit, offset = 0, orderBy, where, withTotal = true } = options

    const whereClause = buildWhere(table, where)
    const orderParts = buildOrderBy(table, orderBy)

    // Drizzle's `from()` uses a conditional type that does not resolve for a bare generic `TTable`;
    // `table` is always a concrete PG table at call sites — narrow to `PgTable` for the builder only.
    let query = db
        .select()
        .from(table as PgTable)
        .$dynamic()

    if (whereClause !== undefined) {
        query = query.where(whereClause)
    }
    if (orderParts !== undefined) {
        query = query.orderBy(...orderParts)
    }

    const rows = (await query
        .limit(limit)
        .offset(offset)) as InferSelectModel<TTable>[]

    let total: number | null = null
    if (withTotal) {
        total =
            whereClause === undefined
                ? await db.$count(table)
                : await db.$count(table, whereClause)
    }

    return { rows, total }
}

/** Converts 1-based page numbers to Drizzle `limit` / `offset`. */
export function getLimitOffset(
    page: number,
    pageSize: number
): { limit: number; offset: number } {
    const safePage = page < 1 ? 1 : page
    const safeSize = pageSize < 1 ? 1 : pageSize
    return {
        limit: safeSize,
        offset: (safePage - 1) * safeSize,
    }
}
