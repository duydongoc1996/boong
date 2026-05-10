import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
}

/**
 * This is the configuration for the Drizzle ORM.
 */
export default defineConfig({
    out: "./drizzle",
    schema: "./src/database/schemas/index.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
})
