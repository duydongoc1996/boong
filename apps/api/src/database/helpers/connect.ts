import type { DrizzleConfig } from "drizzle-orm"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { v7 as uuidv7 } from "uuid"

// Define a type for the arguments to keep the function signature clean
export interface ConnectDatabaseOptions<
    TSchema extends Record<string, unknown>,
> {
    /** The PostgreSQL connection string */
    url: string
    /** Your imported Drizzle schema */
    schema: TSchema
    /** Optional configurations specific to postgres.js (e.g., max connections) */
    postgres?: postgres.Options<Record<string, postgres.PostgresType>>
    /** Optional configurations specific to Drizzle ORM (e.g., logger) */
    drizzle?: Omit<DrizzleConfig<TSchema>, "schema">
}

/**
 * Connects to a PostgreSQL database using postgres.js and Drizzle ORM.
 * @template TSchema - The generic type inferred from your schema object.
 * @returns A fully typed Drizzle database instance.
 */
export function connectDatabase<TSchema extends Record<string, unknown>>(
    options: ConnectDatabaseOptions<TSchema>
): { db: PostgresJsDatabase<TSchema>; queryClient: postgres.Sql } {
    // 1. Initialize the postgres.js client
    const queryClient = postgres(options.url, options.postgres)

    // 2. Initialize and return the Drizzle ORM instance
    return {
        db: drizzle(queryClient, {
            schema: options.schema,
            ...options.drizzle,
        }),
        queryClient,
    }
}

export function generateID() {
    return uuidv7()
}
