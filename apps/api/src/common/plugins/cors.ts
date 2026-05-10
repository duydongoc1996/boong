import cors from "@elysia/cors"
import { config } from "./config"

export const pluginCors = () =>
    cors({
        origin: config.ALLOWED_ORIGINS,
    })
