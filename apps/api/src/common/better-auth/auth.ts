import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import type { Context } from "elysia"
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

const betterAuthView = (context: Context & { request: Request }) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    // validate request method
    if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request)
    } else {
        return context.status(405, {
            message: "Method not allowed",
        })
    }
}

export const pluginAuth = () => {
    return new Elysia({ name: "plugin-auth" })
        .decorate("auth", auth)
        .all("/api/auth/*", betterAuthView)
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
