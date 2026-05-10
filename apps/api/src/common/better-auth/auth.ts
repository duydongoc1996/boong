import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { Elysia } from "elysia"
import type { OpenAPIV3 } from "openapi-types"
import { db } from "@/database/db"
import { BETTER_AUTH_CONFIG } from "./config"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),

    ...BETTER_AUTH_CONFIG,
})

export const pluginAuth = () => {
    return new Elysia({ name: "plugin-auth" })
        .decorate("auth", auth)
        .mount(auth.handler)
}

export async function getOpenApiSchema(prefix: string) {
    const schema = await auth.api.generateOpenAPISchema()

    const paths = Object.entries(schema.paths).reduce(
        (acc, [path, value]) => {
            acc[prefix + path] = value as OpenAPIV3.PathItemObject
            return acc
        },
        {} as Record<string, OpenAPIV3.PathItemObject>
    )

    return {
        openapi: schema.openapi,
        security: schema.security,
        tags: schema.tags,
        paths: paths,
        components: schema.components as OpenAPIV3.ComponentsObject,
    }
}
