import { Elysia } from "elysia"
import z from "zod"

// Define the shape of your environment variables
export const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.url().default("http://localhost:4000"),
    ALLOWED_ORIGINS: z
        .array(z.string())
        .default([
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://localhost:4000",
        ]),
})

export type Config = z.infer<typeof EnvSchema>

const env = EnvSchema.safeParse(process.env)

if (!env.success) {
    console.error("❌ Invalid environment variables:")
    console.error(z.prettifyError(env.error))
    process.exit(1)
}

export const config = env.data

export const pluginConfig = () =>
    new Elysia({ name: "plugin-config" })
        .decorate("config", env.data)
        .onStart(() => {
            console.log("✅ Environment variables verified")
        })
